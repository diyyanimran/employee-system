import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../employee-list/employee-service';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { IBasicInfo } from '../DTOs/basic-info';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../DTOs/token-payload';

@Component({
  selector: 'app-worklogs',
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatLabel,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './worklogs.html',
  styleUrl: './worklogs.css'
})
export class Worklogs implements OnInit {
  constructor(private employeeService: EmployeeService, 
    private route: ActivatedRoute, 
    private router: Router) { }

  names: IBasicInfo[] = [];
  selectedId: number | null = null;

  ngOnInit(): void {
    this.route.firstChild?.paramMap.subscribe(
      params => {
        this.selectedId = Number(params.get('id'));
      }
    );

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe 
      ( () =>
      {
        const url = this.router.url; 
        if (url == "/dashboard/worklogs")
          this.selectedId = null;
      }
      )

    this.employeeService.getAllNamesAndIDs().subscribe
      ({
        next: n => {
          this.names = n;
        },
        error: err => console.error(err.error)
      })
  }

  onSelected(): void {
    this.router.navigate(["/dashboard/worklogs", this.selectedId]);
  }
}
