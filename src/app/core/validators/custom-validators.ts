import { AbstractControl, FormControl, FormGroupDirective, NgForm, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CustomValidator {
  static matchValues(control: AbstractControl, matchTo: string): ValidationErrors | null {
    return !!control.parent &&
      !!control.parent.value &&
      control.value === (control.parent.controls as { [key: string]: AbstractControl })[matchTo]?.value
      ? null
      : { invalidMatching: true };
  }
  static validateInputConfirm(formControl: AbstractControl, valCompare: string): ValidationErrors | null {
    if (formControl.value !== valCompare) {
      return { invalidInputConfirm: true };
    }
    return null;
  }
  static validatePackageName(formControl: AbstractControl): ValidationErrors | null {
    if (!formControl || !formControl.value || !formControl.value.includes('.')) {
      return { invalidPackage: true };
    }
    return null;
  }

  static validateDateRangeRequire(formControl: AbstractControl, checkWith: string): ValidationErrors | null {
    if (!formControl.parent || !formControl.parent.controls) {
      return null;
    }
    const parentControls = formControl.parent?.controls as any;
    const valCheck: string = parentControls[checkWith]?.value;
    if (formControl.value || !valCheck) {
      return null;
    }
    return { invalidDateRangeRequire: true };
  }

  static validateGreaterDate(control: AbstractControl, matchingControlName: string, interval?: number): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const parentControls = control.parent?.controls as any;
    if (!parentControls) {
      return null;
    }
    const matchingControl = parentControls[matchingControlName];
    if (!matchingControl) {
      return null;
    }
    if (!control.value || !matchingControl.value) {
      return null;
    }
    const matchDate = matchingControl.value instanceof Date
      ? new Date(matchingControl.value.toISOString())
      : new Date(matchingControl.value);
    matchDate.setSeconds(0);
    if (interval && interval > 0) {
      matchDate.setMinutes(matchDate.getMinutes() + interval );
    }

    const currentValue = new Date(
      control.value instanceof Date
        ? control.value.toISOString()
        : control.value);
    currentValue.setSeconds(59);
    if (currentValue < matchDate) {
      return { invalidDateGreaterConfirm: true };
    } else {
      return null;
    }
  }
  

  static validateDateGreaterToday(formControl: AbstractControl, oldValue?: string): ValidationErrors | null {
    if (!formControl.value) {
      return null;
    }
    const minutes = 20;
    const dtCheck = new Date();
    dtCheck.setSeconds(0);
    dtCheck.setMinutes(dtCheck.getMinutes() + minutes );

    let dt: Date = oldValue
      ? new Date(oldValue)
      : new Date();

    if (dt <= new Date() || dt > dtCheck) {
      dt = dtCheck;
    }
    const currentDt = new Date(formControl.value);
    currentDt.setSeconds(59);
    if (currentDt >= dt) {
      return null;
    }
    return { invalidCompareToday: true };
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && isSubmitted && (control.dirty || control.touched));
  }
}