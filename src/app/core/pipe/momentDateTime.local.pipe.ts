import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'momentLocalDateTime'
})
export class MomentLocalDateTimePipe extends DatePipe implements PipeTransform {
    transform(
        value: any,
        format: string = 'MM/dd/YYYY hh:mm',
    ): any {
        const timezoneOffset = moment(value).format('Z');
        return super.transform(value, format, timezoneOffset);
    }
}
