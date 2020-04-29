import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'tmssDate' })
export class TmssDatePipe implements PipeTransform {
  transform(value: number, format: string) {
    return value ? moment(new Date(value)).format(format ? format : 'DD/MM/YYYY HH:mm') : '';
  }
}
