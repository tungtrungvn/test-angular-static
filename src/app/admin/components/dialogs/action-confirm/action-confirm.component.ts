import { Component, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPopupInfo } from '@app/models/interfaces/common.interface';

@Component({
  selector: 'app-action-confirm-dialog',
  templateUrl: 'action-confirm.component.html',
  styleUrls: ['./action-confirm.component.scss'],
})
export class ActionConfirmDialogComponent {
  public onDialogSubmit = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<ActionConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPopupInfo,
  ) {
  }

  onSubmit(): void {
    this.onDialogSubmit.emit();
    this.dialogRef.close();
  }
}
