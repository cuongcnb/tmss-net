import {Component, EventEmitter, forwardRef, Input, AfterViewInit, OnInit, Output, ViewChild, ElementRef, OnChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isFunction} from 'util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSearchComponent),
      multi: true
    }]
})
export class InputSearchComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnChanges {
  @ViewChild('input', {static: false}) input: ElementRef;
  @Input() maxLength;
  @Input() ignoreEnterEvent: boolean;
  @Input() showBtn: boolean;
  @Input() isReadonly: boolean;
  @Input() isKeepFocus: boolean;
  @Input() isRequired: boolean;
  @Input() alwaysEnableBtn: boolean;
  @Input() placeholder;
  @Input() focus;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSearch = new EventEmitter();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onFocus = new EventEmitter();
  // tslint:disable-next-line:ban-types
  private onChange: Function;
  isDisabled: boolean;
  value = '';

  constructor() {
  }

  search(e) {
    if (!this.ignoreEnterEvent && e.key === 'Enter') {
      this.blurInput();
    }
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.setFocus();
  }

  ngOnChanges() {
    this.setFocus();
  }


  setFocus() {
    setTimeout(() => {
      if (!!this.focus && this.input) {
        this.input.nativeElement.focus();
        this.onFocus.emit();
        this.focus = false;
      }
    }, 100);
  }

  blurInput() {
    if (!this.alwaysEnableBtn && this.isDisabled) {
      return;
    }
    this.onSearch.emit(this.value);
    this.input.nativeElement.blur();

    if (this.isKeepFocus) {
      this.input.nativeElement.focus();
    }
  }

  changeValue(e) {
    this.value = e.target.value;
    if (isFunction(this.onChange)) {
      this.onChange(e.target.value);
    }
  }

  writeValue(val) {
    this.value = val || '';
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
