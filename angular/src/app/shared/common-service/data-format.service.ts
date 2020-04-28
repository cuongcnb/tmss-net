import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import * as moment from 'moment';

@Injectable()
export class DataFormatService {

  constructor() {
  }

  moneyFormat(value) {
    return value ? Math.round(value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '0';
  }

  numberFormat(value) {
    if (value === 0) {
      return '0';
    }
    // @ts-ignore
    // return value ? parseFloat(Math.round((+value) * 100) / 100).toFixed(2) : '';
    return value ? parseFloat(value).toString() : '';
  }

  formatDateTime(date) {
    const isFirefox = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
    if (date) {
      let convertDate;
      if (typeof date === 'string' && date.length === 1) {
        return date;
      }

      if (isFirefox && typeof date === 'string') {
        const dateArr = date.split('-');
        date = `${dateArr[1]} ${dateArr[0]}, ${dateArr[2]}`;
      }
      convertDate = new Date(date);
      const displayDate = convertDate.getDate() < 10 ? `0${convertDate.getDate()}` : convertDate.getDate();
      const formattedMonth = convertDate.getMonth() < 9 ? `0${convertDate.getMonth() + 1}` : convertDate.getMonth() + 1;
      const displayMonth = moment(formattedMonth, 'MM').format('MMM');

      return convertDate ? `${convertDate.getFullYear()}-${displayMonth}-${displayDate} ${convertDate.getHours()}:${convertDate.getMinutes()}` : '';
    }
    return '';
  }

  parseMoneyToValue(val) {
    if (typeof val === 'string') {
      return parseFloat(val.replace(/,/g, ''));
    }
    return val;
  }

  parseDateToMonthString(date) {
    return date ? moment(new Date(date)).format('MMM-YY') : '';
  }
  consvertTimeToSeconnds(time: string): number {
    return time.split(':').reverse().reduce((prev, curr, i) => prev + +curr * Math.pow(60, i), 0);
  }
  parseTimestampToDate(num) {
    return num ? moment(new Date(num)).format('DD/MM/YYYY') : '';
  }

  parseTimestampToDateString(num) {
    // 2019-Mar-12
    return num ? moment(new Date(num)).format('DD-MMM-YYYY') : '';
  }

  parseTimestampToDateBasic(num) {
    return num ? moment(new Date(num)).format('DD/MM/YYYY') : '';
  }

  parseTimestampToFullDate(num) {
    return num ? moment(new Date(num)).format('DD/MM/YYYY, HH:mm') : '';
  }

  parseTimestampToHourMinute(num) {
    return num ? moment(new Date(num)).format('HH:mm') : '';
  }

  parseTimestampToYear(num) {
    return num ? moment(new Date(num)).format('YYYY') : '';
  }

  formatDate(date) {
    if (date) {
      let convertDate;
      if (typeof date === 'string' && date.length === 1) {
        return date;
      }

      if (typeof date === 'string' && date.indexOf('năm') > -1) {
        return moment(date, 'LLL', 'vi').valueOf();
      }

      convertDate = new Date(date);
      return convertDate ? convertDate.getTime() : '';
    }

    return '';
  }

  formatDateSale(date) {
    const isFirefox = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
    if (date) {
      let convertDate;
      if (typeof date === 'string' && date.length === 1) {
        return date;
      }

      if (isFirefox && typeof date === 'string') {
        const dateArr = date.split('-');
        date = `${dateArr[1]} ${dateArr[0]}, ${dateArr[2]}`;
      }
      convertDate = new Date(date);
      const displayDate = convertDate.getDate() < 10 ? `0${convertDate.getDate()}` : convertDate.getDate();
      const formattedMonth = convertDate.getMonth() < 9 ? `0${convertDate.getMonth() + 1}` : convertDate.getMonth() + 1;
      const displayMonth = moment(formattedMonth, 'MM').format('MMM');

      return convertDate ? `${displayDate}-${displayMonth}-${convertDate.getFullYear()}` : '';
    }
    return '';
  }



  formatMonth(date) { // Using in cbu-lexus-ckd-field.ts
    if (date) {
      const convertDate = new Date(date);
      const formattedMonth = convertDate.getMonth() < 9 ? `0${convertDate.getMonth() + 1}` : convertDate.getMonth() + 1;
      return convertDate ? `${formattedMonth}/${convertDate.getFullYear()}` : '';
    }
    return '';
  }

  formatHoursSecond(seconds) {
    if (seconds && seconds > 0) {
      const hours = Math.floor(seconds / 3600) < 10 ? `0${Math.floor(seconds / 3600)}` : Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60) < 10 ? `0${Math.floor((seconds % 3600) / 60)}` : Math.floor((seconds % 3600) / 60);
      // const second = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
      return `${hours}:${minutes}`;
    } else if (seconds === 0) {
      return `00:00`;
    } else if (!seconds) {
      return '';
    }
  }

  formatAggridCode(id: number, arr: Array<any>) {
    if (id) {
      const match = arr.find(item => id === item.id);
      return match ? match.code : '';
    }
    return '';
  }

  formatAggridName(id: number, arr: Array<any>) {
    if (id) {
      const match = arr.find(item => id === item.id);
      return match ? match.name : '';
    }
    return '';
  }


  formatDealerAddress(addressId: number, deliveryAtArr) {
    if (addressId) {
      const matchAddress = deliveryAtArr.find(deliveryAt => addressId === deliveryAt.id);
      return matchAddress ? matchAddress.address : '';
    }
    return '';
  }

  convertIdToValue(selectedId: number, valueArr, selectedField?) {
    if (selectedId) {
      const matchAddress = valueArr.find(value => selectedId === value.id);
      const displayField = selectedField ? selectedField : 'value';
      return matchAddress ? matchAddress[displayField] : selectedId;
    }
    return '';
  }

  formatFilterDescription(fieldName, filterFieldArr) {
    if (fieldName) {
      const matchAddress = filterFieldArr.find(value => fieldName === value.fieldName);
      return matchAddress ? matchAddress.fieldDescription : fieldName;
    }
    return '';
  }

  formatMoney(val) {
    if (val) {
      if (typeof val === 'string') {
        let num = val.trim().replace(/\,([0-9]{3})/g, '$1');
        // if ((num).toString() === num) {
        //   return parseFloat(num).toLocaleString('en-US');
        // }

        num = val.trim().replace(/\,/g, '');
        const NUMBER_REGEX = /^([0-9]*)$/g;
        if (NUMBER_REGEX.test(num)) {
          return parseFloat(num).toLocaleString('en-US');
        }
        return val;
      } else {
        const num = val.toString().replace(/\,/g, '');
        return parseFloat(num) ? parseFloat(num).toLocaleString('en-US') : val;
      }
    }
    return 0;
  }

  formatQty(val) {
    if (val) {
      if (typeof val === 'string') {
        let num = val.trim().replace(/,([0-9]{1})/g, '$1');
        if (parseFloat(num).toString() === num) {
          return parseFloat(num).toLocaleString();
        }

        num = val.trim().replace(/,/g, '');
        const NUMBER_REGEX = /^([0-9]*)$/g;
        if (NUMBER_REGEX.test(num)) {
          return parseFloat(num).toLocaleString();
        }
        return val;
      } else {
        const num = val.toString().replace(/,/g, '');
        return parseFloat(num) ? parseFloat(num).toLocaleString() : val;
      }
    }
    return null;
  }

  formatMoneyForm(form: FormGroup, field) {
    form.controls[field].setValue(this.formatMoney(form.controls[field].value));
  }

  public roundNumber(value: any, precision: number): number {
    switch (typeof value) {
      case 'string':
        return parseFloat(parseFloat(value).toFixed(precision));
      case 'number':
        return parseFloat(value.toFixed(precision));
      default:
        return value;
    }
  }

  public roundNumberTwoDecimal(value): number {
    return Math.round(100 * Number(value) / 100);
  }

  parseDateToDateString(date) {
    return date ? moment(new Date(date)).format('DD-MMM-YY') : '';
  }

  formatAlloMonth(date) { // Using in cbu-lexus-ckd-field.ts
    if (date) {
      return date ? moment(new Date(date)).format('MMM-YY') : '';
    }
    return '';
  }

  formatHoursMinutesToNumber(hours, minutes) {
    return hours || minutes
      ? (hours * 3600 + minutes * 60).toString()
      : null;
  }

  formatEngDate(date, withDay) {
    const monthNames = [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct',
      'Nov', 'Dec'
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return (withDay ? day + '-' : '') + monthNames[monthIndex] + '-' + year;
  }


  formatBankId(bankId: number, bankList) {
    if (bankId) {
      const match = bankList.find(item => bankId === item.id);
      return match ? match.bankCode : '';
    }
    return '';
  }

  formatGradeCode(gradeId: number, gradeList) {
    if (gradeId) {
      const matchGrade = gradeList.find(grade => gradeId === grade.id);
      return matchGrade ? matchGrade.marketingCode : '';
    }
    return '';
  }
}
