import {Injectable} from '@angular/core';

@Injectable()
export class DateService {
  public getLastMonday(timestamp: number | null): number {
    const currentDate = timestamp === null ? new Date() : new Date(timestamp * 1000);
    const offsetDay = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1 ;
    const lastmonday = new Date(currentDate.setDate(currentDate.getDate() - offsetDay ));
    lastmonday.setHours(0);
    lastmonday.setMinutes(0);
    lastmonday.setSeconds(0);
    lastmonday.setMilliseconds(0);
    return Math.floor(lastmonday.getTime() / 1000);
  }

  public getNextMonday(timestamp: number): number {
    const currentDate = timestamp === null ? new Date() : new Date(timestamp * 1000);
    const offsetDay = currentDate.getDay() === 0 ? -1 : currentDate.getDay() - 8 ;
    const lastmonday = new Date(currentDate.setDate(currentDate.getDate() - offsetDay ));
    lastmonday.setHours(0);
    lastmonday.setMinutes(0);
    lastmonday.setSeconds(0);
    lastmonday.setMilliseconds(0);
    return Math.floor(lastmonday.getTime() / 1000);
  }

  public isInWeek(timestamp: number, weekTimestamp: number): boolean {
    if ( timestamp >= this.getLastMonday(weekTimestamp) && timestamp < this.getNextMonday(weekTimestamp)) {
      return true;
    } else {
      return false;
    }
  }
}
