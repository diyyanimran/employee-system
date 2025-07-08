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
      DatePipe
    ],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class MessageComponent implements OnInit{
  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private loginService: LoginService
  ) { }
  params = {} as Param;

  chatOpened: boolean = false;
  noMessages: boolean = true;
  isAdmin: boolean = false;

  employees: IBasicInfo[] = [];
  selectedId: number | null = null;
  userId: number = Number(localStorage.getItem('employeeId'));
  userSelected: boolean = false;

  messages: IMessage[] = [];
  messageText: string = "";
  currentDate: Date | null = null;

  ngOnInit(): void {
    this.getRole();
  }

  toggleChat(): void {
    if (this.chatOpened) {
      this.chatOpened = false;
    }
    else {
      this.chatOpened = true;
      this.loadEmployees();
    }
  }

  getRole(): void {
    const employeeId = this.userId;

    this.loginService.getRole(employeeId).subscribe
      ({
        next: (response: { role: string; }) => this.isAdmin = ("Admin" == response.role),
        error: err => console.log(err.error)
      })
  }

  loadEmployees(): void {
    if (!this.isAdmin) {
      this.employeeService.getAdmins().subscribe
        ({
          next: response => {
            this.employees = response.filter(e => e.id !== this.userId);
          },
          error: err => console.error(err.error)
        })
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

  onSelected(): void {
    this.loadMessages();
    this.userSelected = true;
    this.messageText = "";
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

  sendMessage(): void {
    if (!this.messageText.trim()) return;
    this.params = {} as Param;
    this.params.Text = this.messageText;
    this.params.SenderId = this.userId;
    this.params.ReceiverId = this.selectedId!;
    this.messageService.sendMessage(this.params).subscribe
      ({
        next: response => {
          this.noMessages = false;
          this.messages.unshift
          ({text: this.messageText, 
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
