import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceAfterComma'
})
export class SpaceAfterCommaPipe implements PipeTransform {
  transform(text: string): string {
    const newText = text ? text.replace(/,/g, ', '): '';
    return newText;
  }
}