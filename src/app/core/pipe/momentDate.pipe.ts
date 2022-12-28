import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'momentDate'
})
export class MomentDatePipe extends DatePipe implements PipeTransform {
    transform(
        value: any,
        format: string = 'MM/dd/YYYY',
        timezone: string = 'America/New_York'
    ): any {
        const timezoneOffset = moment(value).tz(timezone).format('Z');
        return super.transform(value, format, timezoneOffset);
    }
}
