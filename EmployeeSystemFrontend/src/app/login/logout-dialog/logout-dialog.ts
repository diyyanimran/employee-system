import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-logout-dialog',
  imports: 
  [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './logout-dialog.html',
  styleUrl: './logout-dialog.css'
})
export class LogoutDialog {
  constructor(public dialogRef: MatDialogRef<LogoutDialog>) {}

  confirm(): void {
    this.dialogRef.close(true);
    
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
