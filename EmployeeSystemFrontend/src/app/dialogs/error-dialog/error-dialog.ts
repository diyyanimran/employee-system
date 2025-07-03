import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  imports: 
  [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './error-dialog.html',
  styleUrl: './error-dialog.css'
})
export class ErrorDialog {
  constructor (
    public dialogRef: MatDialogRef<ErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {message: string}) {}
}
