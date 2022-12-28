import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DoctorService } from '@app/core/services/doctor.service';
import { IUserInfo } from '@app/models/interfaces/users.interface';
import { ChangePasswordDialogComponent } from '../dialogs/change-password/change-password.component';
import * as moment from 'moment-timezone';
import { GoogleService } from '@app/core/services/google.service';
import { MyErrorStateMatcher } from '@core/validators/custom-validators';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.scss']
})
export class DoctorProfileComponent implements OnInit {
  @Output() public updateProfile: EventEmitter<any> = new EventEmitter();
  @Output() public uploadAvatar: EventEmitter<File> = new EventEmitter();
  @ViewChild('editForm') editForm: FormGroupDirective;
  @Input() public newAvatar: any;
  matcher = new MyErrorStateMatcher();
  profileForm: FormGroup;
  editMode: boolean = false;
  isHasInvalid: boolean = false;
  isHasError: boolean = false;
  fieldError: string = '';
  selectedFile: File;
  specialty: string;
  specialties: any[];
  autocompleteAddress: any[];
  addressDetail: any = {
    address: '',
    city: '',
    state: '',
    zipCode: ''
  };
  today: Date = new Date();

  constructor(
    private _doctorService: DoctorService,
    private _googleService: GoogleService,
    private _dialog: MatDialog,
  ) {
    this.profileForm = new FormGroup({
      email: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[\w]{1,}[\w.+-]{0,}@[\w-]{1,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/),
          Validators.email,
        ]),
      ),
      firstName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      lastName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      specialty: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      address: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      city: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      state: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      zipCode: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      phone: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern("^[0-9]{10}$"),
      ]),
      birthday: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      gender: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      clinicName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      npi: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern("^[0-9]{10}$"),
      ]),
      dea: new FormControl({ value: '', disabled: true }, []),
      fax: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern("^[0-9]{10}$"),
      ]),
      avatar: new FormControl('', []),
    });
  }

  ngOnInit() {
    this.getSpecialties();
  }

  loadProfile() {
    this._doctorService.getDoctorProfile().subscribe((response: IUserInfo) => {
      this.specialty = this.specialties.find((splt) => splt.value === Number(response.specialty))?.text;
      this.profileForm.setValue({
        email: response.email || '',
        firstName: response.firstName || '',
        lastName: response.lastName || '',
        birthday: response.birthday ? new Date(response.birthday) : null,
        gender: response.gender?.toString() || '',
        specialty: Number(response.specialty) || '',
        address: response.address || '',
        city: response.city || '',
        state: response.state || '',
        zipCode: response.zipCode || '',
        phone: response.phone || '',
        avatar: response.avatarUrl || '',
        clinicName: response.clinicName || '',
        npi: response.npi || '',
        dea: response.dea || '',
        fax: response.fax || '',
      });
    })
  }

  getSpecialties() {
    this._doctorService.getSpecialties().subscribe(response => {
      this.specialties = response;
      this.loadProfile();
    })
  }

  startEditMode() {
    this.editMode = true;
    this.profileForm.enable();
  }

  cancleEditMode() {
    this.editMode = false;
    this.isHasInvalid = false;
    this.newAvatar = '';
    this.profileForm.disable();
    this.loadProfile();
  }

  onSubmit() {
    this.hasFormInvalid();
    if (!this.isHasInvalid && !this.isHasError) {
      const profile = { ...this.profileForm.value }
      this.profileForm.value.specialty = this.profileForm.value.specialty.toString();
      this.specialty = this.specialties.find((splt) => splt.value === Number(this.profileForm.value.specialty))?.text;
      this.profileForm.value.birthday = moment(this.profileForm.value.birthday, 'YYYY/MM/DD').add(12, 'hours');
      this.updateProfile.emit({
        profile: this.profileForm.value,
        specialty: this.specialty
      });
      this.editMode = false;
      this.editForm.resetForm();
      this.profileForm.setValue(profile);
      this.profileForm.disable();
    }
  }

  changePassword() {
    this._dialog.open(
      ChangePasswordDialogComponent,
      {
        panelClass: 'custom-dialog',
        width: '600px',
        data: ''
      }
    );
  }

  onFileChanged(event: any) {
    if (event) {
      var reader = new FileReader();
      this.newAvatar = event.target.files;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.newAvatar = reader.result;
      }
      this.selectedFile = event.target.files[0];
      this.uploadAvatar.emit(this.selectedFile);
    }
  }

  getGoogleAddress(text: any) {
    const query = `?input=${text}`;
    this._googleService.getGoogleAddress(query).subscribe((response: any) => {
      this.autocompleteAddress = response.predictions;
    }, error => {
      console.log('Error: ', error);
    });
  }

  getAddressDetail(placeId: string) {
    const query = `?place_id=${placeId}`;
    this._googleService.getAddressDetail(query).subscribe((response: any) => {
      const addressComponent = response.result?.address_components;
      const streetNumber = addressComponent.find((adr: any) => adr.types.includes('street_number'))?.long_name || '';
      const route = addressComponent.find((adr: any) => adr.types.includes('route'))?.long_name || '';
      this.addressDetail = {
        address: `${streetNumber} ${route}`.trim(),
        city: addressComponent.find((adr: any) => adr.types.includes('locality'))?.long_name,
        state: addressComponent.find((adr: any) => adr.types.includes('administrative_area_level_1'))?.short_name,
        zipCode: addressComponent.find((adr: any) => adr.types.includes('postal_code'))?.long_name,
      };
    }, error => {
      console.log('Error: ', error);
    });
  }

  get f(): any {
    return this.profileForm.controls;
  }

  hasFormInvalid() {
    if (this.f.phone.errors?.pattern || this.f.fax.errors?.pattern || this.f.npi.errors?.pattern) {
      this.isHasError = true;
      this.isHasInvalid = false;
      this.fieldError = this.f.phone.errors?.pattern ? 'phone' : this.f.fax.errors?.pattern ? 'fax' : 'npi';
    } else {
      this.isHasInvalid = this.profileForm.invalid;
      this.isHasError = false;
    }
  }

  isTyping() {
    this.isHasError = false;
  }
}
