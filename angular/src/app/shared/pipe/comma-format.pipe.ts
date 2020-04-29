import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaFormat'
})
export class CommaFormatPipe implements PipeTransform {

  transform(val): string {
    if (val) {
      if (typeof val === 'string') {
        let num = val.trim().replace(/,([0-9]{3})/g, '$1');
        if (parseInt(num, 10).toString().length === num.length) {
          return parseInt(num, 10).toLocaleString();
        }
        num = val.trim().replace(/,/g, '');
        if (num.length > 3) {
          return parseInt(num, 10).toLocaleString();
        }
        return val;
      } else {
        const num = val.toString().replace(/,/g, '');
        return parseInt(num, 10) ? parseInt(num, 10).toLocaleString() : val;
      }
    }
    return '';
  }
}
