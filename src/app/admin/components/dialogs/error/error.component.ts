import { Component, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: 'error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorDialogComponent {
  public onDialogSubmit = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
  ) {
  }

  onSubmit(): void {
    this.onDialogSubmit.emit();
    this.dialogRef.close();
  }
}
