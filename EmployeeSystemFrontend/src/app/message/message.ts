import { Component } from '@angular/core';
import { IMessage } from '../DTOs/message';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmployeeService } from '../employee-list/employee-service';
import { IBasicInfo } from '../DTOs/basic-info';
import { CommonModule } from '@angular/common';
import { MessageService } from '../services/message-service';
import { Param } from '../DTOs/params.model';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule
  ],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class MessageComponent {

  constructor (
    private employeeService: EmployeeService,
    private messageService: MessageService
  ) {}
  params = {} as Param;

  chatOpened: boolean = false;
  noMessages: boolean = true;

  employees: IBasicInfo[] = [];
  selectedId: number | null = null;
  userId: number = Number(localStorage.getItem('employeeId'));
  userSelected: boolean = false;

  messages: IMessage[] = [];
  messageText: string = "";

  toggleChat(): void
  {
    if (this.chatOpened)
    {
      this.chatOpened = false;
    }
    else
    {
      this.chatOpened = true;
      this.loadEmployees();
    }
  }
  
  loadEmployees(): void
  {
    this.employeeService.getAllNamesAndIDs().subscribe
    ({
      next: response => 
        {
          this.employees = response.filter(e => e.id !== this.userId);
        },
      error: err => console.error(err.error)
    })
  }

  onSelected(): void
  {
    this.loadMessages();
    this.userSelected = true;
    this.messageText = "";
  }

  loadMessages(): void
  {
    this.params = {} as Param;
    this.params.ReceiverId = this.selectedId!;
    this.params.SenderId = this.userId;
    this.messageService.getMessages(this.params).subscribe
    ({
      next: response =>
      {
        this.messages = response;
        this.noMessages = false;
      },
      error: err => 
        {
          this.messages = [];
          this.noMessages = true;
        }
    })
  }

  sendMessage(): void
  {
    if (!this.messageText.trim()) return;
    this.params = {} as Param;
    this.params.Text = this.messageText;
    this.params.SenderId = this.userId;
    this.params.ReceiverId = this.selectedId!;
    console.log("Sending: ", this.params);
    this.messageService.sendMessage(this.params).subscribe
    ({
      next: response =>
      {
        this.loadMessages();
        this.messageText = "";
      }
    })
  }
}
