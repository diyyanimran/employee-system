import { AfterViewInit, Component } from '@angular/core';
import { AttendanceService } from '../../services/attendance-service';
import { ActivatedRoute } from '@angular/router';
import { IAttendance } from '../../DTOs/attendance';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QrCheckin } from '../../qr-checkin/qr-checkin';
import { DialogService } from '../../services/dialog-service';

@Component({
  selector: 'app-employee-check-in-out',
  imports:
    [
      MatCardModule,
      DatePipe,
      MatTableModule,
      MatIconModule,
      MatButtonModule,
      MatDialogModule,
      CommonModule
    ],
  templateUrl: './employee-check-in-out.html',
  styleUrl: './employee-check-in-out.css'
})
export class EmployeeCheckInOut implements AfterViewInit {
  constructor(
    private attendanceService: AttendanceService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  selectedId!: number;
  todaysAttendance: IAttendance[] = [];
  message: string = "";
  color: string = "green";
  checkedIn: boolean = false;

  isPresent: boolean = false;
  isLeaveAllowed: boolean = false;

  displayedColumns: string[] =
    ['checkInTime', 'checkOutTime'];

  ngAfterViewInit(): void {

    this.route.paramMap.subscribe(params => {
      this.selectedId = Number(params.get('id'));
      this.message = "";
      this.loadTodaysAttendance();
    }
    )
  }

  loadTodaysAttendance(): void {
    this.attendanceService.getTodaysAttendance(this.selectedId).subscribe
      ({
        next: a => {
          this.todaysAttendance = a;
          this.updateSummary();
          if (this.todaysAttendance.length > 0
            && this.todaysAttendance[this.todaysAttendance.length - 1]
              .checkOutTime == null
          ) {
            this.checkedIn = true;
          }
          else
            this.checkedIn = false;
        },
        error: err => { 
          console.log(err.error);
          this.updateSummary();
          this.todaysAttendance = [];
          this.checkedIn = false;
        }
      })
  }

  checkIn(result: string): void {
    const parsed = JSON.parse(result);
    if (parsed.employeeId != this.selectedId)
    {
      this.dialogService.showError("Incorrect QR Code");
      return;
    }

    this.attendanceService.checkIn(this.selectedId).subscribe(
      {
        next: response => {
          this.message = "Successfully Checked In";
          this.color = "green";
          this.loadTodaysAttendance();
          this.checkedIn = true;
        },
        error: err => console.log(err.error)
      }
    );
  }

  openQrScanner(): void {
  this.dialog.open(QrCheckin).afterClosed().subscribe(result => {
    if (result) {
      this.checkIn(result);
    }
  });
}

  checkOut(): void {
    this.attendanceService.checkOut(this.selectedId).subscribe(
      {
        next: response => {
          this.message = "Successfully Checked Out";
          this.color = "green";
          this.loadTodaysAttendance();
          this.checkedIn = false;
        },
        error: err => 
          {
            this.dialogService.showError(err.error);
          }
      }
    );
  }

  updateSummary(): void 
  {
    this.attendanceService.getStatus(
      this.selectedId, 
      new Date()
    )
    .subscribe
    ({
      next: response =>
      {
        this.isPresent = response.present;
        this.isLeaveAllowed = response.leaveAllowed;
      },
      error: err => console.log(err.error)
    })
  }
}
