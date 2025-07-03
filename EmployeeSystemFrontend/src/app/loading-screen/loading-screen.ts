import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../services/loading-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading-screen',
  imports: 
  [
    CommonModule
  ],
  templateUrl: './loading-screen.html',
  styleUrl: './loading-screen.css'
})
export class LoadingScreen {
  loading$: Observable<boolean>;
  constructor(private loadingService: LoadingService) 
  {
    this.loading$ = this.loadingService.loading$;
  }
}
