import {Component, ElementRef, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DataFormatService} from '../common-service/data-format.service';
import {isFunction} from 'util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tmss-timepicker',
  templateUrl: './tmss-timepicker.component.html',
  styleUrls: ['./tmss-timepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TmssTimepickerComponent),
      multi: true
    }]
})
export class TmssTimepickerComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @Input() text: string;
  @Input() isRequired: boolean;
  // tslint:disable-next-line:ban-types
  private onChange: Function;
  isDisabled: boolean;
  isShow: boolean;
  selectedValue;
  displayValue;

  // @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isShow = false;
    }
  }

  constructor(
    private dataFormat: DataFormatService,
    private elementRef: ElementRef
  ) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.addEventListener('click', (event) => {
      this.onClick(event, event.target);
    });
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.removeEventListener('click', (event) => {
      this.onClick(event, event.target);
    });
  }

  onChoosenValue() {

    if (isFunction(this.onChange)) {
      this.isShow = false;
      this.displayValue = this.dataFormat.parseTimestampToHourMinute(this.selectedValue);
      this.onChange(this.dataFormat.formatDate(this.selectedValue));
    }
  }

  writeValue(val: any): void {
    this.displayValue = this.dataFormat.parseTimestampToHourMinute(val);
    this.selectedValue = this.dataFormat.parseTimestampToFullDate(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
