import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ErrorDialog } from '../dialogs/error-dialog/error-dialog';
import { ConfirmationDialog } from '../dialogs/confirmation-dialog/confirmation-dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private dialog: MatDialog
  ) { }

  public showError(message: string): void {
    this.dialog.open(ErrorDialog, {
      data: { message }
    });
  }

  public confirmation(message: string, title: string): Observable<boolean>
  {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {message, title}
    })
    return dialogRef.afterClosed();
  }
}
