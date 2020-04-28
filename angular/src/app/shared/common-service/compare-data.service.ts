import { Injectable } from '@angular/core';
import { DataFormatService } from './data-format.service';

@Injectable()
export class CompareDataService {

  constructor(
    private  dataFormatService: DataFormatService) {
  }

  compareTwoDate(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const getDate = date => {
      return Math.floor(new Date(this.removeTimeInDate(date)).getTime() / oneDay);
    };
    return getDate(date1) - getDate(date2);
  }

  calculateDate(date: Date, distance: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + distance);
  }

  compareTwoTime(time1: string, time2: string): number {
    const milliseconds = time => {
      const timeSplit = time ? time.split(':') : [];
      const hourNumber = +timeSplit[0] || 0;
      const minuteNumber = +timeSplit[1] || 0;
      const target = parseInt(this.dataFormatService.formatHoursMinutesToNumber(hourNumber, minuteNumber), 10) || 0;
      return target;
    };
    return milliseconds(time1) - milliseconds(time2);
  }

  private removeTimeInDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  }
}
