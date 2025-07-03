import { Component, OnInit } from '@angular/core';
import { WorklogsService } from '../../services/worklogs-service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IWorklog } from '../../DTOs/worklogs';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../../DTOs/token-payload';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { DialogService } from '../../services/dialog-service';
import { LoginService } from '../../services/login-service';

@Component({
  selector: 'app-employee-worklogs',
  imports:
    [
      MatTableModule,
      CommonModule,
      RouterModule,
      MatIconModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatSelectModule,
      MatOptionModule,
      MatCardModule
    ],
  templateUrl: './employee-worklogs.html',
  styleUrl: './employee-worklogs.css'
})
export class EmployeeWorklogs implements OnInit {
  constructor(
    private worklogService: WorklogsService,
    private loginService: LoginService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  selectedId!: number;
  worklogs: IWorklog[] = [];

  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  columnNames: string[] = ['task', ...this.days];

  rows: {
    task: string;
    data: { [key: string]: number };
  }[] = [
      { task: 'Developing', data: {} },
      { task: 'Designing', data: {} },
      { task: 'Fixing', data: {} },
      { task: 'Total', data: {} }
    ];

  isAdmin: boolean = false;
  formsLoaded: boolean = false;

  newWorklogForm!: FormGroup;
  newWorklog!: IWorklog;
  isAddingNew: boolean = false;
  errorMessageNew: string = "";

  updateWorklogForm!: FormGroup;
  updateWorklog!: IWorklog;
  isUpdating: boolean = false;
  errorMessageUpdate: string = "";

  ngOnInit(): void {
    this.getRole();

    this.route.paramMap.subscribe(params => {
      this.selectedId = Number(params.get('id'));

      this.loadWorklogs();
    }
    );
  }

  getRole(): void {
    const employeeId = Number(localStorage.getItem('employeeId'));

    this.loginService.getRole(employeeId).subscribe
    ({
      next: response => this.isAdmin = ("Admin" == response.role),
      error: err => console.log(err.error)
    })
  }

  loadWorklogs(): void {
    this.worklogService.getWorkLogs(this.selectedId).subscribe
      ({
        next: w => {
          this.worklogs = w;
          this.mapLogsToRows();
          this.loadForms();
        },
        error: err => {
          console.error(err.error),
            this.worklogs = [];
          this.loadForms();
          this.mapLogsToRows();
        }
      });
  }

  loadForms(): void {
    this.newWorklogForm = new FormGroup
      ({
        dayControl: new FormControl('Monday', Validators.required),
        designing: new FormControl<number | null>(null, Validators.pattern(/^\d+(\.\d+)?$/)),
        developing: new FormControl<number | null>(null, Validators.pattern(/^\d+(\.\d+)?$/)),
        fixing: new FormControl<number | null>(null, Validators.pattern(/^\d+(\.\d+)?$/))
      });

    this.updateWorklogForm = new FormGroup
      ({
        dayControl: new FormControl('Monday', Validators.required),
        designing: new FormControl<number>(this.getValue(0), Validators.pattern(/^\d+(\.\d+)?$/)),
        developing: new FormControl<number | null>(this.getValue(1), Validators.pattern(/^\d+(\.\d+)?$/)),
        fixing: new FormControl<number | null>(this.getValue(2), Validators.pattern(/^\d+(\.\d+)?$/))
      });

    this.formsLoaded = true;

    this.updateWorklogForm.get('dayControl')?.valueChanges.subscribe(day => {
      const log = this.worklogs.find(w => w.day === day);
      if (log) {
        this.updateWorklogForm.patchValue({
          designing: log.designing,
          developing: log.developing,
          fixing: log.fixing
        });
      } else {
        this.updateWorklogForm.patchValue({
          designing: 0,
          developing: 0,
          fixing: 0
        });
      }
    });
  }

  mapLogsToRows(): void {
    const devData: { [key: string]: number } = {};
    const desData: { [key: string]: number } = {};
    const fixData: { [key: string]: number } = {};
    const totalData: { [key: string]: number } = {};

    for (const log of this.worklogs) {
      devData[log.day] = log.developing;
      desData[log.day] = log.designing;
      fixData[log.day] = log.fixing;
      totalData[log.day] = log.developing + log.fixing + log.designing;
    }

    this.rows[0].data = devData;
    this.rows[1].data = desData;
    this.rows[2].data = fixData;
    this.rows[3].data = totalData;
  }

  toggleAddingNew(): void {
    this.isAddingNew = !this.isAddingNew;
  }

  toggleUpdating(): void {
    this.isUpdating = !this.isUpdating;
  }

  onFormSubmitNew(): void {
    if (!this.validateFormNew()) {
      return;
    }

    this.newWorklog =
    {
      day: this.newWorklogForm.controls['dayControl'].value,
      designing: this.returnValue(this.newWorklogForm.controls['designing'].value),
      developing: this.returnValue(this.newWorklogForm.controls['developing'].value),
      fixing: this.returnValue(this.newWorklogForm.controls['fixing'].value)
    }

    this.worklogService.addWorklog(this.selectedId, this.newWorklog).subscribe
      ({
        next: response => {
          this.loadWorklogs();
        },
        error: err => console.error(err.error)
      });

    this.isAddingNew = false;
    this.newWorklogForm.reset();
  }

  validateFormNew(): boolean {
    if (!this.newWorklogForm.controls['dayControl'].valid) {
      this.dialogService.showError("You must select a day");
      return false;
    }

    if (
      this.newWorklogForm.controls['developing'].value == null
      && this.newWorklogForm.controls['designing'].value == null
      && this.newWorklogForm.controls['fixing'].value == null
    ) {
      this.dialogService.showError("You must update atleast one field");
      return false;
    }

    if (!this.newWorklogForm.controls['developing'].valid
      || !this.newWorklogForm.controls['designing'].valid
      || !this.newWorklogForm.controls['fixing'].valid
    ) {
      this.dialogService.showError("You can only write numbers");
      return false;
    }

    this.errorMessageNew = "";
    return true;
  }

  returnValue(val: number | null): number {
    if (val === null)
      return 0;
    else
      return val;
  }

  getValue(val: number): number {
    const defaultLog = this.worklogs.find(w => w.day == "Monday");
    if (!defaultLog)
      return 0;
    else
      switch (val) {
        case 0: return defaultLog.designing;
        case 1: return defaultLog.developing;
        case 2: return defaultLog.fixing;
        default: return 0;
      }
  }

  cancelNewWorklog(): void {
    this.isAddingNew = false;
    this.newWorklogForm.reset();
  }

  onFormSubmitUpdate(): void {
    if (!this.validateFormUpdate()) {
      return;
    }

    this.updateWorklog =
    {
      day: this.updateWorklogForm.controls['dayControl'].value,
      designing: this.returnValue(this.updateWorklogForm.controls['designing'].value),
      developing: this.returnValue(this.updateWorklogForm.controls['developing'].value),
      fixing: this.returnValue(this.updateWorklogForm.controls['fixing'].value)
    }

    this.worklogService.updateWorklog(this.selectedId, this.updateWorklog).subscribe
      ({
        next: response => {
          this.loadWorklogs();
        },
        error: err => console.error(err.error)
      });

    this.isUpdating = false;
    this.updateWorklogForm.reset();
  }

  validateFormUpdate(): boolean {
    if (!this.updateWorklogForm.controls['dayControl'].valid) {
      this.dialogService.showError("You must select a day");
      return false;
    }

    if (
      this.updateWorklogForm.controls['developing'].value == null
      && this.updateWorklogForm.controls['designing'].value == null
      && this.updateWorklogForm.controls['fixing'].value == null
    ) {
      this.dialogService.showError("You must update atleast one field");
      return false;
    }

    if (!this.updateWorklogForm.controls['developing'].valid
      || !this.updateWorklogForm.controls['designing'].valid
      || !this.updateWorklogForm.controls['fixing'].valid
    ) {
      this.dialogService.showError("You can only write numbers");
      return false;
    }

    this.errorMessageUpdate = "";
    return true;
  }

  cancelUpdateWorklog(): void {
    this.isUpdating = false;
  }

  deleteWorklog(day: string): void {
    this.dialogService.confirmation
      ("Are you sure you want to delete this worklog?", "Delete Worklog")
      .subscribe
      (
        remove => {
          if (remove) {
            this.worklogService.removeWorklog(this.selectedId, day).subscribe
              ({
                next: () => this.loadWorklogs(),
                error: err => console.error(err.error)
              });
          }
        }
      )
  }
}
