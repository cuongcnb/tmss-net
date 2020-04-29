import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isFunction } from 'util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    }],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() text: string;
  @Input() textClassName: string;
  @Input() isReadonly: string;
  @ViewChild('iCheckBox', {static: false}) iCheckBox;
  @Input() styleClass;
  // tslint:disable-next-line:ban-types
  private onChange: Function;
  @Input() selectedValue;
  @Input() isDisabled;
  @Input() rightCheckbox = false;
  @Input() labelWidth;

  constructor() {
  }

  changeValue(val) {
    if (this.isDisabled || this.isReadonly) {
      return;
    }

    if (isFunction(this.onChange)) {
      this.onChange(val);
      this.selectedValue = val;
    }
    if (val) {
      this.iCheckBox.nativeElement.classList.add('checked');
    } else {
      this.iCheckBox.nativeElement.classList.remove('checked');
    }
  }

  writeValue(val) {
    this.selectedValue = val || false;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }
}
