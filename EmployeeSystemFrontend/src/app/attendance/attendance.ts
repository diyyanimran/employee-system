import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { IBasicInfo } from '../DTOs/basic-info';
import { EmployeeService } from '../employee-list/employee-service';
import { MatCardModule } from '@angular/material/card';
import { LoginService } from '../services/login-service';

@Component({
  selector: 'app-attendance',
  imports:
    [
      RouterModule,
      MatSelectModule,
      MatOptionModule,
      ReactiveFormsModule,
      FormsModule,
      CommonModule,
      MatCardModule
    ],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class Attendance implements OnInit {
  selectedId: number | null = null;
  names: IBasicInfo[] = [];
  username!: string;
  isAdmin!: boolean;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getRole();
    this.username = localStorage.getItem("username")!;
    this.route.firstChild?.paramMap.subscribe(
      params => {
        this.selectedId = Number(params.get('id'));
      }
    );

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe
      (() => {
        const url = this.router.url;
        if (url == "/dashboard/attendance") {
          this.selectedId = null;
        }

      }
      )
    if (this.isAdmin) {
      this.employeeService.getAllNamesAndIDs().subscribe
        ({
          next: n => {
            this.names = n;
          },
          error: err => console.error(err.error)
        })
    }
  }

  onSelected(): void {
    this.router.navigate(["/dashboard/attendance", this.selectedId]);
  }

  getRole(): Promise<void> {
    const employeeId = Number(localStorage.getItem('employeeId'));

    return new Promise((resolve, reject) => {
      this.loginService.getRole(employeeId).subscribe
        ({
          next: response => {
            this.isAdmin = ("Admin" == response.role);
            resolve();
          },
          error: err => {
            console.log(err.error);
            reject();
          }
        })
    })
  }
}
