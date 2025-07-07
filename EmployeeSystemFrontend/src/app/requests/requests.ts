import { Component, OnInit, ViewChild } from '@angular/core';
import { IRequest } from '../DTOs/request';
import { LoginService } from '../services/login-service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu'
import {  Router, RouterModule } from '@angular/router';
import { DialogService } from '../services/dialog-service';
import { Param } from '../DTOs/params.model';

@Component({
  selector: 'app-requests',
  imports:
    [
      MatTableModule,
      MatButtonModule,
      MatIconModule,
      MatMenuModule,
      RouterModule
    ],
  templateUrl: './requests.html',
  styleUrl: './requests.css'
})
export class Requests implements OnInit {
  constructor(
    private loginService: LoginService,
    private dialogService: DialogService,
    private router: Router
  ) { }

  requests: IRequest[] = [];
  message: string = "";
  params = {} as Param;

  displayedColumns: string[] = ['name', 'role', 'actions'];
  selectedRow: any;

  ngOnInit(): void {
    this.getRequests();
  }

  getRequests(): void {
    this.loginService.getRequests().subscribe
      ({
        next: response => {
          this.requests = response;
        },
        error: err => this.requests = []
      })
  }

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  openContextMenu(event: MouseEvent, row: any) {
    event.preventDefault();
    this.selectedRow = row;

    this.trigger.openMenu();
  }

  approve(row: any): void {
    this.params = {} as Param;
    this.params.Name = row.name;
    this.params.Role = row.role;
    this.loginService.approveRequest(this.params).subscribe
      ({
        next: res => {
          this.router.navigate(['/dashboard/employees'],
            {
              queryParams: {
                openAdd: 'true',
                name: row.name
              }
            }
          );
        },
        error: err => this.dialogService.showError(err.error)
      })
  }

  reject(row: any): void {
    this.dialogService.confirmation(
      `Are you sure you want to reject ${row.name}'s request`,
      "Reject Request?"
    ).subscribe(
      {
        next: confirmed => {
          if (confirmed) {
            this.params = {} as Param;
            this.params.Name = row.name;
            this.params.Role = row.role;
            this.loginService.rejectRequest(this.params).subscribe(
              { 
                next: res => this.getRequests(),
                error: err => this.dialogService.showError(err.error)
              }
            );
          }
        }
      }
    )
  }
}
