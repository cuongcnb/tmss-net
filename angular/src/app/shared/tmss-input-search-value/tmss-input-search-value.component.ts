import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tmss-input-search-value',
  templateUrl: './tmss-input-search-value.component.html',
  styleUrls: ['./tmss-input-search-value.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TmssInputSearchValueComponent),
      multi: true,
    },
  ],
})
export class TmssInputSearchValueComponent implements ControlValueAccessor {
  @Input() text: string;
  @Input() addOnMinWidth: string;
  @Input() isRequired: boolean;
  @Input() listData: any[];
  @Input() valueField: any; // value of this field will be displayed
  @Input() keyField: any; // value of this field will stay in the background and send as request

  // tslint:disable-next-line:ban-types
  private onChange: Function;
  isDisabled: boolean;
  displayValue;

  constructor() {
  }

  writeValue(val) {
    if (val) {
      const matchedData = this.listData.find(data => data[this.keyField] === val);
      if (matchedData) {
        this.displayValue = matchedData[this.valueField];
      }
    } else {
      this.displayValue = '';
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched() {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput() { // input event
    this.onChange(this.matchedValue(this.displayValue));
  }

  matchedValue(value) {
    const matchedData = this.listData.find(data => data[this.valueField] === value);
    if (matchedData) {
      return matchedData[this.keyField];
    }
    return null;
  }
}
