import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OpentokService } from '@app/core/services/opentok.service';
import { IPopupInfo } from '@app/models/interfaces/common.interface';
import { PendingCallAppointment } from '@app/models/interfaces/videocall.interface';

@Component({
  selector: 'app-pending-call-dialog',
  templateUrl: './pending-call-dialog.component.html',
  styleUrls: ['./pending-call-dialog.component.scss']
})
export class PendingCallDialogComponent implements OnInit {
  public onRejoinSubmit = new EventEmitter();
  public onEndSubmit = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<PendingCallDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PendingCallAppointment
  ) { }

  ngOnInit(): void {
  }

  onRejoin(): void {
    this.onRejoinSubmit.emit();
    this.dialogRef.close();
  }

  onEnd() {
    this.onEndSubmit.emit();
    this.dialogRef.close();
  }

}
