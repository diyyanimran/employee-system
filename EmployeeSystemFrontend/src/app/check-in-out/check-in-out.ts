import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { IBasicInfo } from '../DTOs/basic-info';
import { EmployeeService } from '../employee-list/employee-service';
import { filter } from 'rxjs';
import { LoginService } from '../services/login-service';

@Component({
  selector: 'app-check-in-out',
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
  templateUrl: './check-in-out.html',
  styleUrl: './check-in-out.css'
})
export class CheckInOut {
  selectedId: number | null = null;
  names: IBasicInfo[] = [];
  employeeInfo: IBasicInfo | null = null;
  isAdmin!: boolean;

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getRole();

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
        if (url == "/dashboard/checkInOut") {
          this.selectedId = null;
        }
      }
      )

    this.employeeService.getAllNamesAndIDs().subscribe
      ({
        next: n => {
          this.names = n;
          this.verifyRole();
        },
        error: err => console.error(err.error)
      })
  }

  onSelected(): void {
    this.router.navigate(["/dashboard/checkInOut", this.selectedId]);
  }

  getRole(): void {
    const employeeId = Number(localStorage.getItem('employeeId'));

    this.loginService.getRole(employeeId).subscribe
    ({
      next: response => this.isAdmin = ("Admin" == response.role),
      error: err => console.log(err.error)
    })
  }

  verifyRole(): void {
    this.employeeInfo = this.names.find(e => e.name === localStorage.getItem('username')) ?? null;
    this.selectedId = this.employeeInfo?.id ?? null;
    this.router.navigate(['/dashboard/checkInOut', this.employeeInfo?.id])
  }
}
