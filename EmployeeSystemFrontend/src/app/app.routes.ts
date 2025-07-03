import { Routes } from '@angular/router';
import { Login } from './login/login';
import { LoginGuard } from './guards/login-guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'signup',
        loadComponent: () =>
            import('./signup/signup').
                then(m => m.Signup)
    },
    {
        path: 'dashboard',
        canActivate: [LoginGuard],
        loadComponent: () =>
            import('./dashboard/dashboard').
                then(m => m.Dashboard),
        children:
            [
                {
                    path: '',
                    redirectTo: 'employees',
                    pathMatch: 'full'
                },
                {
                    path: 'employees',
                    loadComponent: () =>
                        import('./employee-list/employee-list').
                            then(m => m.EmployeeList)
                },
                {
                    path: 'worklogs',
                    loadComponent: () =>
                        import('./worklogs/worklogs').
                            then(m => m.Worklogs),
                    children:
                        [
                            {
                                path: ':id',
                                loadComponent: () =>
                                    import('./worklogs/employee-worklogs/employee-worklogs').
                                        then(m => m.EmployeeWorklogs)
                            }
                        ]
                },
                {
                    path: 'attendance',
                    loadComponent: () =>
                        import('./attendance/attendance').
                            then(m => m.Attendance),
                    children:
                        [
                            {
                                path: ':id',
                                loadComponent: () =>
                                    import('./attendance/employee-attendance/employee-attendance').
                                        then(m => m.EmployeeAttendance)
                            }
                        ]

                },
                {
                    path: 'checkInOut',
                    loadComponent: () =>
                        import('./check-in-out/check-in-out').
                            then(m => m.CheckInOut),
                    children:
                        [
                            {
                                path: ':id',
                                loadComponent: () =>
                                    import('./check-in-out/employee-check-in-out/employee-check-in-out').
                                        then(m => m.EmployeeCheckInOut)
                            }
                        ]

                },
                {
                    path: 'requests',
                    loadComponent: () =>
                        import('./requests/requests').
                            then(m => m.Requests)
                }
            ]
    },
    {
        path: 'employees',
        loadComponent: () =>
            import('./employee-list/employee-list').
                then(m => m.EmployeeList)
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
