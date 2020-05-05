import { ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isFunction } from 'util';
import { DataFormatService } from '../common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tmss-datepicker-sale',
  templateUrl: './tmss-datepicker-sale.component.html',
  styleUrls: ['./tmss-datepicker-sale.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TmssDatepickerSaleComponent),
      multi: true,
    }]
})
export class TmssDatepickerSaleComponent implements OnInit, ControlValueAccessor {
  @Input() addOnMinWidth: string;
  @Input() className: string;
  @Input() daysDisabled;
  @Input() showDeleteBtn: boolean;
  @Input() minDate: Date;
  @Input() dateInputFormat: string;
  @Input() maxDate: Date;
  @Input() text: string;
  @Input() isRequired: boolean;
  @Input() showMonth: boolean;
  // @ts-ignore
  // tslint:disable-next-line:ban-types
  private onChange: Function;
  isDisabled: boolean;
  selectedValue;

  constructor(
    private dataFormatService: DataFormatService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.cdr.detectChanges();
  }

  onValueChange(val) {
    this.selectedValue = this.dataFormatService.formatDateSale(val);
    if (isFunction(this.onChange)) {
      this.onChange(this.selectedValue);
    }
  }

  remove() {
    this.selectedValue = null;
    if (isFunction(this.onChange)) {
      this.onChange(null);
    }
  }

  writeValue(val) {
    if (val !== null || this.selectedValue !== undefined) {

      const isFirefox = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
      if (isFirefox && typeof val === 'string') {
        const dateArr = val.split('-');
        val = `${dateArr[1]} ${dateArr[0]}, ${dateArr[2]}`;
      }

      if (this.selectedValue !== undefined && val !== this.selectedValue) {

        this.selectedValue = val ? new Date(val.toString()) : '';

      }

    }

    // const isFirefox = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
    // if (isFirefox && typeof val === 'string') {
    //   const dateArr = val.split('-');
    //   val = `${dateArr[1]} ${dateArr[0]}, ${dateArr[2]}`;
    // }

    // this.selectedValue = val ? new Date(val.toString()) : '';
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
  }

  onShown(container) {
    if (this.showMonth) {
      container.monthSelectHandler = (event: any): void => {
        container._store.dispatch(container._actions.select(event.date));
      };
      container.setViewMode('month');
      return;
    }
    let isBreak = false;
    // tìm những elem trong tháng
    const arr = [];
    const elems = document.querySelectorAll('span[bsdatepickerdaydecorator]');
    elems.forEach(item => {
      if (item.classList.contains('selected')) {
        isBreak = true;
      }

      if (!item.classList.contains('is-other-month') && !isBreak) {
        arr.push(item);
      }
    });

    if (isBreak) {
      return;
    } else {
      const date = new Date().getDate();
      arr[date - 1].classList.add('selected');
    }
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

}
