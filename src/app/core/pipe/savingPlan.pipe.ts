import { Pipe, PipeTransform } from '@angular/core';
import { ESavingPlan } from '@enums/savingPlan.enum';

@Pipe({
  name: 'savingPlan'
})
export class SavingPlanPipe implements PipeTransform {
  transform(amount: number, frequency: string, day: string = ''): string {
    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
    const newAmount = currencyFormatter.format(amount);
    let newFrequency = '';
    let dayOfWeek = '';
    switch (frequency) {
      case 'weekly': {
        newFrequency = ESavingPlan.weekly;
        dayOfWeek = this.getDay(day);
      }
      break;
      case 'biweekly': {
        newFrequency = ESavingPlan.biweekly;
        dayOfWeek = this.getDay(day);
      }
      break;
      case 'monthly':
        newFrequency = ESavingPlan.monthly;
        break;
    }
    return `${newAmount} ${newFrequency} ${dayOfWeek ? `on ${dayOfWeek}` : ''}`;
  }

  private getDay(day: string): string {
    if (!day) {
      return '';
    }
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const dayIndex = JSON.parse(day)[0];
    return days[dayIndex - 1];
  }
}
