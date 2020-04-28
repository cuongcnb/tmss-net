import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IeCalculateDateService {

  constructor() { }

  calculate(date) {
    if (date) {
      const isIE11 = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
      if (isIE11) {
        return new Date(date.substring(0, 19) + 'Z');
      } else {
        return new Date(date);
      }
    }
  }

}
