import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tmss-text-editor',
  templateUrl: './tmss-text-editor.component.html',
  styleUrls: ['./tmss-text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TmssTextEditorComponent),
      multi: true,
    }]
})
export class TmssTextEditorComponent implements OnInit, ControlValueAccessor {

  @Input() selectedValue;
  @Input() isDisabled: boolean;
  @Input() placeHolder: string;
  @Input() height: string;
  resizer: string;
  @Input() text: string;
  // tslint:disable-next-line:ban-types
  private onChange: Function;
  config;

  constructor() {
  }

  ngOnInit() {
    this.resizer = 'none';
    this.config = {
      height: '100px',
      placeholder: 'Nội dung ...',
    };
  }

  getValue() {
    this.onChange(this.selectedValue);
  }

  writeValue(val) {
    this.selectedValue = val;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {}

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }
}
