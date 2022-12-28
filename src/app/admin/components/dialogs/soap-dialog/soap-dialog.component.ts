import { Component, Inject, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-soap-dialog',
  templateUrl: './soap-dialog.component.html',
  styleUrls: ['./soap-dialog.component.scss']
})
export class SoapDialogComponent {
  onDialogSubmit = new EventEmitter();
  soapForm!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<SoapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.soapForm = new FormGroup({
      subjective: new FormControl(this.data.soapNote?.subjective),
      objective: new FormControl(this.data.soapNote?.objective),
      assessment: new FormControl(this.data.soapNote?.assessment),
      plan: new FormControl(this.data.soapNote?.plan)
    });  
  }

  onSubmit(): void {
    const soap = this.soapForm.value;
    this.onDialogSubmit.emit(soap);
    this.dialogRef.close();
  }
}
