import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataShareService } from '@app/core/services/data-share.service';

@Component({
  selector: 'app-video-soap',
  templateUrl: './soap.component.html',
  styleUrls: ['./soap.component.scss']
})
export class SoapComponent {
  soapForm!: FormGroup;
  @Output() soapDataChange: EventEmitter<any> = new EventEmitter();
  constructor(private dataShareService: DataShareService) {
    this.soapForm = new FormGroup({
      subjective: new FormControl(),
      objective: new FormControl(),
      assessment: new FormControl(),
      plan: new FormControl()
    }); 

    const soapData = this.dataShareService.getSoapData();
    if (soapData) {
      this.soapForm.setValue(soapData);
    }

    this.soapForm.valueChanges.subscribe(() =>{
      const val = this.soapForm.value;
      this.soapDataChange.emit(val);
    })      
  }
}
