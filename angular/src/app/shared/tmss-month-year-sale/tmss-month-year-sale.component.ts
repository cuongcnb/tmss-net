import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isFunction } from 'util';
import {DataFormatService} from '../common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tmss-month-year-sale',
  templateUrl: './tmss-month-year-sale.component.html',
  styleUrls: ['./tmss-month-year-sale.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TmssMonthYearSaleComponent),
      multi: true,
    }],
})
export class TmssMonthYearSaleComponent implements OnInit, ControlValueAccessor {
  @Input() isMonth = false;
  @Input() className: string;
  @Input() text: string;
  @Input() isRequired: boolean;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChangeSelectedValue = new EventEmitter();
  @Input() addOnMinWidth: string;
  dateInputFormat;

  // tslint:disable-next-line:ban-types
  private onChange: Function;
  isDisabled: boolean;
  selectedValue;

  constructor(
    private dataFormatService: DataFormatService
  ) {
  }

  ngOnInit() {
    this.dateInputFormat = this.isMonth ? 'MM/YYYY' : 'YYYY';
  }

  onValueChange(val) {
    this.selectedValue = val;
    console.log(this.selectedValue);
    if (isFunction(this.onChange)) {
      this.onChange(this.dataFormatService.formatDateSale(val));
    }
    this.onChangeSelectedValue.next(this.selectedValue);
  }

  writeValue(val) {
    console.log(typeof val, val);
    if (typeof val === 'string') {
      this.selectedValue = val ? new Date(val) : '';
    } else if (typeof val === 'number') {
      this.selectedValue = val ? new Date(val) : '';
    } else {
      this.selectedValue = val ? val : '';
    }
    console.log(this.selectedValue);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
  }

  onOpenCalendar(container) {
    if (this.isMonth) {
      container.monthSelectHandler = (event: any): void => {
        container._store.dispatch(container._actions.select(event.date));
      };
      container.setViewMode('month');
    } else {
      container.yearSelectHandler = (event: any): void => {
        container._store.dispatch(container._actions.select(event.date));
      };
      container.setViewMode('year');
    }
  }
}
