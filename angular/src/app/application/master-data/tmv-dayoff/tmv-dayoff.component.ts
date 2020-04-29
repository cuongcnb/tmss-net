import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {times} from 'lodash';
import {FormArray, FormBuilder} from '@angular/forms';
import {WeekDays} from '../../../core/constains/dates';
import {TmvDayoffService} from '../../../api/master-data/tmv-dayoff.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tmv-dayoff',
  templateUrl: './tmv-dayoff.component.html',
  styleUrls: ['./tmv-dayoff.component.scss']
})
export class TmvDayoffComponent implements OnInit {
  @ViewChild('iCheckBox', {static: false}) iCheckBox;
  @Input() isTMV: boolean;
  pageTitle;
  selectedDate;
  selectedMonth: number;
  selectedYear: number;
  firstWeekDay;
  firstSunIndex: number;
  daysOfMonth: number;
  weekDays = WeekDays;
  rows = times(6, num => num);
  columns = times(7, num => num);
  form: FormArray;
  isResetForm: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private tmvDayOffService: TmvDayoffService,
    private loadingService: LoadingService,
    private formStoringService: FormStoringService,
    private dataFormatService: DataFormatService,
    private toastService: ToastService
  ) {
  }

  ngOnInit() {
    this.selectedDate = null;
    this.generateDayRange();
    this.pageTitle = this.isTMV ? 'TMV Dayoff' : 'DLR Dayoff';
  }

  getDayFromLocalStorage() {
    return this.isTMV ? this.formStoringService.get(StorageKeys.tmvDayOff) : this.formStoringService.get(StorageKeys.dlrDayOff);

  }

  generateDayRange(selectedDay?) {
    this.isResetForm = false;
    this.selectedDate = !selectedDay ? (this.getDayFromLocalStorage() ? new Date(this.getDayFromLocalStorage()) : new Date())
      : new Date(selectedDay);
    this.formStoringService.set(this.isTMV ? StorageKeys.tmvDayOff : StorageKeys.dlrDayOff, this.selectedDate);
    this.selectedMonth = this.selectedDate.getMonth();
    this.selectedYear = this.selectedDate.getFullYear();
    this.firstWeekDay = (new Date(this.selectedYear, this.selectedMonth, 1).getDay()) % 7;
    this.daysOfMonth = (new Date(this.selectedYear, this.selectedMonth + 1, 0)).getDate();
    this.firstSunIndex = this.firstWeekDay === 0 ? 0 : (6 - this.firstWeekDay + 1);
    this.getDaysOff();
  }

  getDateOfPoint(columnIndex: number, rowIndex: number) {
    return (rowIndex * 7 + columnIndex) - this.firstWeekDay + 1;
  }

  checkAllSat() {
    let firstSatIndex = 6 - this.firstWeekDay;
    const arr = [];
    while (firstSatIndex + 1 <= this.daysOfMonth) {
      arr.push({
        val: this.form.controls[firstSatIndex].value.isDayoff,
        idx: firstSatIndex
      });
      firstSatIndex += 7;
    }
    this.onOffWeekend(arr);
  }

  checkAllSun() {
    let firstSunIndex = this.firstSunIndex;
    const arr = [];
    while (firstSunIndex + 1 <= this.daysOfMonth) {
      arr.push({
        val: this.form.controls[firstSunIndex].value.isDayoff,
        idx: firstSunIndex
      });
      firstSunIndex += 7;
    }
    this.onOffWeekend(arr);
  }

  onOffWeekend(arr) {
    let i = 0;
    const valArray = arr.map(item => item.val);
    if (valArray.indexOf(false) < 0) {
      while (i < arr.length) {
        this.form.controls[arr[i].idx].patchValue({
          isDayoff: false
        });
        i++;
      }
    } else {
      while (i < arr.length) {
        this.form.controls[arr[i].idx].patchValue({
          isDayoff: true
        });
        i++;
      }
    }
  }

  get currentUser() {
    return this.formStoringService.get(StorageKeys.currentUser);
  }

  submit() {
    this.loadingService.setDisplay(true);
    let i = 0;
    const daysOff = [];
    while (i + 1 <= this.daysOfMonth) {
      if (this.form.controls[i].value.isDayoff) {
        const dateSelected = new Date(this.selectedYear, this.selectedMonth, i + 1);
        const dateToRequest = this.dataFormatService.formatDateSale(dateSelected);
        daysOff.push(dateToRequest);
      }
      i++;
    }
    const data = {
      year: this.selectedYear,
      month: this.selectedMonth + 1,
      listDayoff: daysOff,
      calendarCode: this.isTMV ? 'TMV' : 'DLR'
    };
    this.tmvDayOffService.submitDaysOff(data).subscribe(() => {
      this.toastService.openSuccessModal();
    });
    this.loadingService.setDisplay(false);
  }

  forFireFox(date: string) {
    const isFirefox = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
    let val = date;
    if (isFirefox) {
      const dateArr = val.split('-');
      val = `${dateArr[1]} ${dateArr[0]}, ${dateArr[2]}`;
    }
    return val;
  }

  getDaysOff() {
    this.loadingService.setDisplay(true);
    this.tmvDayOffService.getDaysOff(this.selectedMonth + 1, this.selectedYear, this.isTMV ? 'TMV' : 'DLR').subscribe(dates => {
      let daysOffIndex;
      if (dates && dates.length >= 0) {
        daysOffIndex = dates.map(date => {
          return new Date(this.forFireFox(date.dayOff)).getDate() - 1;
        });
      }
      setTimeout(() => {
        this.buildForm(daysOffIndex);
        this.isResetForm = true;
        this.loadingService.setDisplay(false);
      });
    });
  }

  private buildForm(daysOffIndex) {
    const formArray = [];
    if (daysOffIndex && daysOffIndex.length >= 0) {
      for (let idx = 0; idx < this.daysOfMonth; idx++) {
        formArray.push(this.formBuilder.group({
          isDayoff: [daysOffIndex.indexOf(idx) > -1]
        }));
      }
    } else {
      for (let idx = 0; idx < this.daysOfMonth; idx++) {
        formArray.push(this.formBuilder.group({
          isDayoff: [false]
        }));
      }
    }
    this.form = this.formBuilder.array(formArray);
  }
}
