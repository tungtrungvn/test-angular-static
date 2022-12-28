import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'momentLocalDate'
})
export class MomentLocalDatePipe extends DatePipe implements PipeTransform {
    transform(
        value: any,
        format: string = 'MM/dd/YYYY',
    ): any {
        const timezoneOffset = moment(value).format('Z');
        return super.transform(value, format, timezoneOffset);
    }
}
