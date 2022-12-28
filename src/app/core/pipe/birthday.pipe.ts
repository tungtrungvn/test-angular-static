import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'birthdate'
})
export class BirthdatePipe implements PipeTransform {

  transform(date: any, args?: any): any {
    const ageDifMs = Date.now() - new Date(date).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

}