import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isFunction } from 'util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tmss-month-year',
  templateUrl: './tmss-month-year.component.html',
  styleUrls: ['./tmss-month-year.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TmssMonthYearComponent),
      multi: true,
    }],
})
export class TmssMonthYearComponent implements OnInit, ControlValueAccessor {
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

  constructor() {
  }

  ngOnInit() {
    this.dateInputFormat = this.isMonth ? 'MM/YYYY' : 'YYYY';
  }

  onValueChange(val) {
    this.selectedValue = val;
    if (isFunction(this.onChange)) {
      this.onChange(val ? val.getTime() : null);
    }
    this.onChangeSelectedValue.next(this.selectedValue);
  }

  writeValue(val) {
    if (typeof val === 'string') {
      this.selectedValue = val ? new Date(val) : '';
    } else if (typeof val === 'number') {
      this.selectedValue = val ? new Date(val) : '';
    } else {
      this.selectedValue = val ? val : '';
    }
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
