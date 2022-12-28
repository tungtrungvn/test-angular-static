import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberUnread'
})
export class NumberUnreadPipe implements PipeTransform {
  transform(value: number): string {
    if (!value) {
      return '';
    }

    if (value < 100) {
      return `${value}`;
    }

    return '99+';
  }
}