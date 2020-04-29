import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DataFormatService } from '../common-service/data-format.service';
import { CommonService } from '../common-service/common.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tmss-money-input',
  templateUrl: './tmss-money-input.component.html',
  styleUrls: ['./tmss-money-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TmssMoneyInputComponent),
      multi: true,
    },
  ],
})
export class TmssMoneyInputComponent implements ControlValueAccessor {
  @ViewChild('moneyInput', {static: false}) moneyInput: ElementRef;
  @ViewChild('btnSubmit', {static: false}) btnSubmit: ElementRef;
  @Input() text: string;
  @Input() endText: string;
  @Input() isRequired: boolean;
  @Input() addOnMinWidth: number;
  @Input() maxLength;
  @Input() kmBefore;


  // tslint:disable-next-line:ban-types
  private onChange: Function;
  displayValue;
  isDisabled: boolean;

  constructor(
    private dataFormat: DataFormatService,
    private common: CommonService,
  ) {
  }

  onInput(event) {
    this.onChange(this.convertStringMoneyToInt(this.displayValue));
    this.displayValue = this.dataFormat.formatMoney(this.displayValue);
    if (this.kmBefore && this.kmBefore > this.convertStringMoneyToInt(this.displayValue)) {
      event.target.classList.remove('required');
    } else {
      event.target.classList.add('required');
    }
  }

  writeValue(val) {
    this.displayValue = this.common.isEmpty(val) ? '' : this.dataFormat.formatMoney(val.toString());
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched() {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  convertStringMoneyToInt(val) {
    if (val) {
      if (typeof val === 'string') {
        return val.replace(/\,/g, '');
      } else {
        return val;
      }
    }
    return null;
  }
}
