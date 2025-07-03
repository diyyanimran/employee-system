import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ILoginInfo } from '../DTOs/login-info';
import { ILoginResponse } from '../DTOs/login-response';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../services/login-service';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from '../services/dialog-service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatCardModule,
    CommonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  reactiveForm!: UntypedFormGroup;

    defaultUsername: string = "User1";
    defaultPassword: string = "password";
    formSubmitted: boolean = false;
    loginMessage: string = "";
    color: string = "black";
    username: string = "";
    password: string = "";
    role: string = "User";
    showPassword: boolean = false;

    loginInfo!: ILoginInfo;
    loginResponse!: ILoginResponse;

    constructor(
        private loginService: LoginService,
        private dialogService: DialogService,
        private router: Router) { }

    ngOnInit(): void {
        this.reactiveForm = new UntypedFormGroup
            (
                {
                    username: new UntypedFormControl('', [Validators.required, Validators.pattern(/^\S*$/)]),
                    password: new UntypedFormControl('', [Validators.required, Validators.minLength(5), Validators.pattern(/^\S*$/)])
                }
            )
    }

    onFormSubmit(): void {
        this.formSubmitted = true;
        if (!this.reactiveForm.valid)
        {
            this.dialogService.showError("Password must have atleast 5 characters");
            return;
        }
        this.username = this.reactiveForm.controls['username'].value;
        this.password = this.reactiveForm.controls['password'].value;
        this.loginInfo = {username: this.username, password: this.password};


        this.loginService.checkLogin(this.loginInfo).subscribe
        (
                {
                    next: (response) =>
                    {
                        localStorage.setItem('accessToken', response.accessToken);
                        localStorage.setItem('refreshToken', response.refreshToken);
                        localStorage.setItem('username', this.username);
                        localStorage.setItem('employeeId', response.employeeId.toString());
                        this.loginService.login();
                        this.color = "green";
                        this.loginMessage = "Login Successful"
                        this.router.navigate(['/dashboard']);
                    },
                    error: (err) =>
                    {
                        if (err.status == 400)
                        {
                            this.dialogService.showError(err.error);
                        }
                        else if (err.status == 503)
                        {
                            this.dialogService.showError("Too many requests");
                        }
                        else
                        {
                            this.dialogService.showError('An unexpected error occurred');
                        }
                    }
                }
        );
    }

    toggleShowPassword(event: any): void
    {
      this.showPassword = event.checked;
    }
}
