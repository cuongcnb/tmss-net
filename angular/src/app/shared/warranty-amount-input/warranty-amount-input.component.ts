import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { DataFormatService } from '../common-service/data-format.service';
import { CommonService } from '../common-service/common.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'warranty-amount-input',
  templateUrl: './warranty-amount-input.component.html',
  styleUrls: ['./warranty-amount-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WarrantyAmountInputComponent),
      multi: true,
    },
  ],
})
export class WarrantyAmountInputComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('input', {static: false}) amountInput: ElementRef;
  @Input() isRequired: boolean;
  @Input() isReadOnly = true;
  @Input() maxLength: number;
  @Input() hideDecimal: boolean;
  @Input() showThousandOnly: boolean;

  // tslint:disable-next-line:ban-types
  private onChange: Function;
  displayValue;
  isDisabled: boolean;
  private subscription: Subscription;

  constructor(
    private dataFormat: DataFormatService,
    private common: CommonService,
  ) {
  }

  ngAfterViewInit(): void {
    this.subscription = fromEvent(this.amountInput.nativeElement, 'input')
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.displayValue = this.formatDisplayValue(this.showThousandOnly ? +this.displayValue / 1000 : this.displayValue);
        this.onChange(this.convertStringMoneyToInt(this.displayValue));
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  writeValue(val) {
    // val = this.showThousandOnly ? (+val) / 1000 : val;
    // this.displayValue = this.common.isEmpty(val) ? 0 : this.formatDisplayValue(val.toString());
    const convertValue = this.common.isEmpty(val) ? 0 : val;
    this.displayValue = this.formatDisplayValue(this.showThousandOnly ? ((+convertValue) / 1000).toString() : convertValue.toString());
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched() {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Format value for display only
  formatDisplayValue(val) {
    val = this.hideDecimal ? val : this.dataFormat.numberFormat(val);
    if (val) {
      if (typeof val === 'string') {
        let num = val.trim().replace(/,([0-9]{3})/g, '$1');
        if ((+num).toString() === num) {
          return (+num).toLocaleString();
        }

        num = val.trim().replace(/,/g, '');
        const NUMBER_REGEX = /^([0-9]*)$/g;
        if (NUMBER_REGEX.test(num)) {
          return (+num).toLocaleString();
        }
        return val;
      } else {
        const num = val.toString().replace(/,/g, '');
        return (+num) ? (+num).toLocaleString() : val;
      }
    }
    return '';
  }

  convertStringMoneyToInt(val) {
    if (val) {
      return (typeof val === 'string') ? val.replace(/,/g, '') : val;
    }
    return null;
  }
}
