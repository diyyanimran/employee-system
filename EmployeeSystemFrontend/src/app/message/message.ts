import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IMessage } from '../DTOs/message';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmployeeService } from '../employee-list/employee-service';
import { IBasicInfo } from '../DTOs/basic-info';
import { CommonModule, DatePipe } from '@angular/common';
import { MessageService } from '../services/message-service';
import { Param } from '../DTOs/params.model';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../services/login-service';
import { SignalrService } from '../services/signalr-service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-message',
  imports:
    [
      MatSelectModule,
      MatInputModule,
      MatFormFieldModule,
      CommonModule,
      FormsModule,
      MatCardModule,
      MatIconModule,
      MatButtonModule,
      DatePipe,
      MatTableModule
    ],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class MessageComponent implements OnInit {
  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private loginService: LoginService,
    private signalRService: SignalrService
  ) { }
  params = {} as Param;

  chatOpened: boolean = false;
  showTable: boolean = false;
  noMessages: boolean = true;
  isAdmin: boolean = false;
  broadcasting: boolean = false;

  employees: IBasicInfo[] = [];
  selectedId: number | null = null;
  selectedName!: string;
  userId!: number;
  userSelected: boolean = false;

  messages: IMessage[] = [];
  messageText: string = "";
  currentDate: Date | null = null;

  async ngOnInit(): Promise<void> {
    this.userId = Number(localStorage.getItem('employeeId'));
    await this.getRole();

    this.signalRService.startConnection(this.userId);

    this.signalRService.onReceiveMessage((senderId, message) => {
      if (this.selectedId == senderId) {
        this.messages.unshift({
          senderId: senderId,
          receiverId: this.userId,
          text: message,
          time: new Date()
        });
      }
    });
  }

  toggleChat(): void {
    if (this.chatOpened) {
      this.chatOpened = false;
      this.showTable = false;
      this.userSelected = false;
    }
    else {
      this.chatOpened = true;
      this.showTable = true;
      this.loadEmployees();
    }
  }

  goBack()
  {
    this.showTable = true;
    this.selectedId = null;
    this.userSelected = false;
    this.broadcasting = false;
  }

  getRole(): Promise<void> {
    const employeeId = this.userId;

    return new Promise((resolve, reject) => {
      this.loginService.getRole(employeeId).subscribe({
        next: (response: { role: string }) => {
          this.isAdmin = (response.role === "Admin");
          resolve();
        },
        error: err => {
          console.log(err.error);
          reject();
        }
      });
    });


  }

  loadEmployees(): void {
    if (!this.isAdmin) {
      this.selectedId = 1;
      this.selectedName = "Diyyan";
      this.userSelected = true;
      this.loadMessages();
    }
    else {
      this.employeeService.getAllEmployees().subscribe
        ({
          next: response => {
            this.employees = response.filter(e => e.id !== this.userId);
          },
          error: err => console.error(err.error)
        })
    }

  }

  selectUser(receiverId: number, receiverName: string): void
  {
    this.showTable = false;
    this.userSelected = true;
    this.selectedId = receiverId;
    this.selectedName = receiverName;
    this.messageText = "";
    this.loadMessages();
  }

  selectBroadcast(): void
  {
    this.userSelected = true;
    this.showTable = false;
    this.selectedName = "Broadcast";
    this.noMessages = false;
    this.broadcasting = true;
  }

  loadMessages(): void {
    this.params = {} as Param;
    this.params.ReceiverId = this.selectedId!;
    this.params.SenderId = this.userId;
    this.messageService.getMessages(this.params).subscribe
      ({
        next: response => {
          this.messages = response;
          this.noMessages = false;
        },
        error: err => {
          this.messages = [];
          this.noMessages = true;
        }
      })
  }

  sendBroadcast(): void
  {
    this.messages.unshift
            ({
              text: this.messageText,
              receiverId: this.selectedId!,
              senderId: this.userId,
              time: new Date()
            });
            this.noMessages = false;
            

    for (const employee of this.employees)
    {
      this.params = {} as Param;
      this.params.SenderId = this.userId;
      this.params.ReceiverId = employee.id;
      this.params.Text = this.messageText;

      this.messageService.sendMessage(this.params).subscribe
      ({
        next: response => {
        }
      })
    };

    this.messageText = "";
  }

  sendMessage(): void {
    if (!this.messageText.trim()) return;
    if (this.broadcasting)
    {
      this.sendBroadcast();
      return;
    }
    this.params = {} as Param;
    this.params.Text = this.messageText;
    this.params.SenderId = this.userId;
    this.params.ReceiverId = this.selectedId!;
    this.messageService.sendMessage(this.params).subscribe
      ({
        next: response => {
          this.noMessages = false;
          this.messages.unshift
            ({
              text: this.messageText,
              receiverId: this.selectedId!,
              senderId: this.userId,
              time: new Date()
            });
          this.messageText = "";
        }
      })
  }

  checkDateChanged(current: Date, next?: Date): boolean {
    const currentDate = new Date(current).toDateString();
    const nextDate = next ? new Date(next).toDateString() : null;
    return !next || currentDate !== nextDate;
  }


}
