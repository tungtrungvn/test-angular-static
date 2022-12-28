import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'height'
})
export class HeightPipe implements PipeTransform {

  transform(valInches?: number): string {
    if (!valInches) {
      return '';
    }
    const feets = parseInt((valInches / 12).toString());
    const inches = parseInt(valInches.toString()) % 12;
    return `${feets} ft ${inches !== 0 ? (inches.toString() + ' in') : ''}`;
  }

}