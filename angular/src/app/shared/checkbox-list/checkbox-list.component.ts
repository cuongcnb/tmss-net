import { Component, ElementRef, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isFunction } from 'util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxListComponent),
      multi: true,
    }],
})
export class CheckboxListComponent implements ControlValueAccessor {
  @Input() dataList: Array<any>;
  @Input() placeholder;
  @Input() textValue: string; // trường hợp checkbox có input tự nhập tay
  @Input() textClassName: string;
  @Input() isDisabled;


  selectedValue;
  // tslint:disable-next-line:ban-types
  private onChange: Function;

  constructor(
    private elem: ElementRef,
  ) {
  }

  changeValue(val, idx, event?) {
    if (this.isDisabled) {
      return;
    }
    const checkboxItemList = this.elem.nativeElement.querySelectorAll('.checkbox-item');
    if (val !== -999 && isFunction(this.onChange)) {
      (event) ? this.onChange(val) : this.onChange(null);

    }
    if (val === -999 && isFunction(this.onChange)) {
      (event) ? this.onChange(this.textValue) : this.onChange(null);

    }
    this.selectedValue = val;
    if (checkboxItemList && checkboxItemList.length) {
      if (val) {
        checkboxItemList[idx].classList.add('checked');
      } else {
        checkboxItemList[idx].classList.remove('checked');
      }
    }
    if (event === false) {
      checkboxItemList[idx].classList.remove('checked');
      checkboxItemList[idx].classList.add('unchecked');
    }
  }

  onChangeInput(val, event) {
    this.textValue = val;
    if (isFunction(this.onChange)) {
      this.onChange(val);
      this.selectedValue = -999;
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

}
