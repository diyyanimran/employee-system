import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IScannerControls, BrowserQRCodeReader } from '@zxing/browser'

@Component({
  selector: 'app-qr-checkin',
  imports:
    [
      MatDialogModule,
      MatButtonModule,
      CommonModule
    ],
  templateUrl: './qr-checkin.html',
  styleUrl: './qr-checkin.css'
})
export class QrCheckin implements OnInit, OnDestroy {
  private codeReader = new BrowserQRCodeReader();
  private controls: IScannerControls | null = null;

  cameraLoaded: boolean = false;

  constructor(private dialogRef: MatDialogRef<QrCheckin>) { }

  ngOnInit(): void {
    this.startScanner();
  }

  startScanner(): void {
    this.cameraLoaded = false;
    this.codeReader.decodeFromVideoDevice(
      undefined,
      'video-preview',
      (result, error, controls) => {
        this.controls = controls;
        this.cameraLoaded = true;
        if (result) {
          const text = result.getText();
          console.log("QR result: " + text);
          this.stopScanner();
          this.dialogRef.close(text);
        }
      }
    )
  }

  stopScanner(): void {
    this.controls?.stop();
    this.controls = null;
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }
}
