import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../employee-list/employee-service';
import { ActivatedRoute, Router } from '@angular/router';;
import { IAttendance } from '../../DTOs/attendance';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../../DTOs/token-payload';
import { AttendanceService } from '../../services/attendance-service';
import { LoginService } from '../../services/login-service';


@Component({
  selector: 'app-employee-attendance',
  imports:
    [
      MatIconModule,
      MatButtonModule,
      DatePipe,
      MatTableModule,
      MatCardModule,
      MatPaginatorModule,
      CommonModule
    ],
  templateUrl: './employee-attendance.html',
  styleUrl: './employee-attendance.css'
})
export class EmployeeAttendance implements OnInit {
  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private attendanceService: AttendanceService
  ) { }

  selectedId!: number;
  attendances: IAttendance[] = [];
  isAdmin!: boolean;

  displayedColumns: string[] =
    ['checkInTime', 'checkOutTime'];
  message: string = "";

  totalDays: number = 0;
  pagedAttendance: { date: string; records: IAttendance[] }[] = [];
  currentPageIndex: number = 0;

  isLeaveAllowed: boolean = false;
  isPresent: boolean = false;

  ngOnInit(): void {
    this.getRole();

    this.route.paramMap.subscribe(params => {
      this.selectedId = Number(params.get('id'));

      this.loadAttendances();
    }
    )
  }

  getRole(): void {
    const employeeId = Number(localStorage.getItem('employeeId'));

    this.loginService.getRole(employeeId).subscribe
    ({
      next: response => this.isAdmin = ("Admin" == response.role),
      error: err => console.log(err.error)
    })
  }

  loadAttendances(): void {
    this.attendanceService.getAttendances(this.selectedId).subscribe
      ({
        next: a => {
          this.attendances = a;
          this.mapAttendancesToDays();
        },
        error: err => {
          this.totalDays = 0;
        }
      })
  }

  mapAttendancesToDays() {
    const grouped = new Map<string, IAttendance[]>();

    for (const att of this.attendances) {
      const date = new Date(att.checkInTime).toDateString();
      if (!grouped.has(date))
        grouped.set(date, []);
      grouped.get(date)!.push(att);
    }

    const todayStr = new Date().toDateString();
    if (!grouped.has(todayStr)) {
      grouped.set(todayStr, []);
    }

    this.pagedAttendance = Array.from(grouped.entries())
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, records]) => ({
        date, records
      })
      );

    this.totalDays = this.pagedAttendance.length;

    this.updateSummary();
  }

  onPageChange(event: PageEvent): void {
    this.currentPageIndex = event.pageIndex;
    this.loadAttendances();
  }

  updateSummary(): void {
    this.attendanceService.getStatus(
      this.selectedId,
      new Date(this.pagedAttendance[this.currentPageIndex].date)
    )
      .subscribe
      ({
        next: response => {
          this.isPresent = response.present;
          this.isLeaveAllowed = response.leaveAllowed;
        },
        error: err => console.log(err.error)
      })
  }

  allowLeave(): void {
    const currentEntry = this.pagedAttendance?.[this.currentPageIndex];

    const date = currentEntry?.date != null
      ? new Date(currentEntry.date)
      : new Date();
    this.attendanceService.updateLeave
      (
        this.selectedId,
        !this.isLeaveAllowed,
        date
      )
      .subscribe
      ({
        next: response => {
          this.isLeaveAllowed = !this.isLeaveAllowed;
          this.loadAttendances();
        },
        error: err => console.log(err.error)
      })
  }
}
