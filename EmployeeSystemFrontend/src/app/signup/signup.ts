import { Component } from '@angular/core';
import { SignupService } from '../services/signup-service';
import { ReactiveFormsModule, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ISignupInfo } from '../DTOs/signup-info';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeService } from '../employee-list/employee-service';
import { DialogService } from '../services/dialog-service';
import { Param } from '../DTOs/params.model';

@Component({
    selector: 'app-signup',
    imports: [
        ReactiveFormsModule,
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        RouterModule,
        MatCheckboxModule,
        MatCardModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatTooltipModule
    ],
    templateUrl: './signup.html',
    providers: [SignupService],
    styleUrl: './signup.css',
    standalone: true
})
export class Signup {
    reactiveForm!: UntypedFormGroup;
    formSubmitted: boolean = false;
    loginMessage: string = "";
    color: string = "black";

    username: string = "";
    password: string = "";
    role: string = "";
    showPassword: boolean = false;

    params = {} as Param;

    constructor(
        private signupService: SignupService,
        private dialogService: DialogService,
        private router: Router,
        private employeeService: EmployeeService
    ) { }

    ngOnInit(): void {
        this.reactiveForm = new UntypedFormGroup
            (
                {
                    username: new UntypedFormControl('', [Validators.required, Validators.pattern(/^\S*$/)]),
                    password: new UntypedFormControl('', [Validators.minLength(5), Validators.required, Validators.pattern(/^\S*$/)]),
                    isAdmin: new UntypedFormControl(false)
                }
            );
    }

    onFormSubmit(): void {
        this.formSubmitted = true;

        if (!this.reactiveForm.valid) {
            this.dialogService.showError("Password must have atleast 5 characters");
            return;
        }

        this.username = this.reactiveForm.controls['username'].value;
        this.password = this.reactiveForm.controls['password'].value;
        this.role = (this.reactiveForm.controls['isAdmin'].value ? "Admin" : "User");

        this.signUp();
    }

    toggleShowPassword(event: any): void {
        this.showPassword = event.checked;
    }

    signUp(): void {
        this.params = {} as Param;
        this.params.Username = this.username;
        this.params.Password = this.password;
        this.params.Role = this.role;

        this.signupService.signUp(this.params).subscribe
            (
                {
                    next: (response) => {
                        this.color = 'green';
                        this.loginMessage = response.message;
                        this.router.navigate(['/login']);
                    },
                    error: (err) => {
                        this.dialogService.showError(err.error);
                    }
                }
            );
    }
}

