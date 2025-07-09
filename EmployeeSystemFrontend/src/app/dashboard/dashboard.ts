import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LogoutDialog } from '../login/logout-dialog/logout-dialog';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { LoginService } from '../services/login-service';
import { MessageComponent } from '../message/message';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatDialogModule,
    CommonModule,
    MessageComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  constructor(
    private router: Router,
    private loginService: LoginService,
    private dialog: MatDialog) { }

  dashboardText: string = "Employees";
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.getRole();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateDashboardText();
    });

    this.updateDashboardText();
  }

  updateDashboardText(): void {
    const url = this.router.url;
    if (url.includes("/dashboard/employees"))
      this.dashboardText = "Employees";
    else if (url.includes("/dashboard/worklogs"))
      this.dashboardText = "Worklogs";
    else if (url.includes("/dashboard/attendance"))
      this.dashboardText = "Attendance";
    else if (url.includes("/dashboard/checkInOut"))
      this.dashboardText = "Check In/Out";
    else if (url.includes("/dashboard/requests"))
      this.dashboardText = "Signup Requests"
  }

  logout(): void {
    const dialogRef = this.dialog.open(LogoutDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
      }
    }
    )
  }

  navigateIfNotCurrent(path: string): void {
    if (!this.router.url.includes(path)) {
      if (this.isAdmin || path.includes('/employees')) {
        this.router.navigate([path]);
      }
      else
      {
        this.router.navigate([path, Number(localStorage.getItem('employeeId'))]);
      }

    }
  }

  getRole(): void {
    const employeeId = Number(localStorage.getItem('employeeId'));

    this.loginService.getRole(employeeId).subscribe
      ({
        next: response => this.isAdmin = ("Admin" == response.role),
        error: err => console.log(err.error)
      })
  }

}
