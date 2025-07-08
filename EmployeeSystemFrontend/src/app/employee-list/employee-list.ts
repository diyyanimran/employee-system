import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './employee-service';
import { IEmployee } from '../DTOs/employee-info';
import { MatCell, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule, UrlTree } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { INewEmployee } from '../DTOs/new-employee';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { DialogService } from '../services/dialog-service';
import { LoginService } from '../services/login-service';


@Component({
  selector: 'app-employee-list',
  imports:
    [
      MatTableModule,
      RouterModule,
      MatButtonModule,
      MatIconModule,
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatCell,
      MatDividerModule,
      MatCardModule
    ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
  standalone: true
})
export class EmployeeList implements OnInit {

  constructor(
    private employeeService: EmployeeService,
    private dialogService: DialogService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  employees: IEmployee[] = [];
  displayedColumns: string[] =
    ['id', 'name', 'code', 'averageHours',
      'totalHours', 'daysPresent', 'leavesTaken',
      'leavesLeft', 'actions']

  isAdmin: boolean = false;
  reactiveForm!: FormGroup;
  isAddingNew: boolean = false;
  newEmployee!: INewEmployee;
  errorMessage: string = "";
  color: string = "black";

  ngOnInit(): void {
    this.getRole();
    this.loadEmployees();

    this.route.queryParams.subscribe
      (
        params => {
          if (params['openAdd'] === 'true')
            this.isAddingNew = true;
          if (params['name'])
            this.reactiveForm.get('name')?.setValue(params['name']);

          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true
          });
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

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe
      ({
        next: employees => {
          this.employees = employees;
        },
        error: err => {
          console.error(err.error),
            this.employees = []
        }
      })

    this.reactiveForm = new FormGroup
      ({
        name: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]),
        code: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)])
      })
  }

  goToWorkLogs(id: number): void {
    this.router.navigate(['dashboard/worklogs', id])
  }

  toggleAddingNew(): void {
    this.isAddingNew = !this.isAddingNew;
  }

  onFormSubmit(): void {
    if (!this.reactiveForm.controls['name'].valid) {
      this.dialogService.showError("Names can only have letters and spaces");
      return;
    }
    if (!this.reactiveForm.controls['code'].valid) {
      this.dialogService.showError("Code can only have numbers");
      return;
    }

    this.newEmployee =
    {
      name: this.reactiveForm.controls['name'].value,
      code: this.reactiveForm.controls['code'].value
    }

    this.reactiveForm.reset();

    this.employeeService.addEmployee(this.newEmployee).subscribe
      ({
        next: reponse => {
          this.errorMessage = "";
          this.loadEmployees();
        },
        error: err => {
          if (err.status == 400) {
            this.dialogService.showError(err.error);
          }
          console.error(err.error);
        }
      })

    this.isAddingNew = false;
  }

  cancelNewEmployee(): void {
    this.isAddingNew = false;
    this.reactiveForm.reset();
  }

  deleteEmployee(id: number, name: string): void {
    this.dialogService.confirmation
      (`Are you sure you want to remove ${name} as an employee?`, "Remove Employee")
      .subscribe
      (
        remove => {
          if (remove) {
            this.employeeService.removeEmployee(id).subscribe
              ({
                next: () => this.loadEmployees(),
                error: err => console.error(err.error)
              });
          }
        }
      )

  }
}
