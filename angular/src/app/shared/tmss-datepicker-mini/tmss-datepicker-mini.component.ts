import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TmssDatepickerComponent } from '../tmss-datepicker/tmss-datepicker.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tmss-datepicker-mini',
  templateUrl: './tmss-datepicker-mini.component.html',
  styleUrls: ['./tmss-datepicker-mini.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TmssDatepickerMiniComponent),
      multi: true,
    }]
})
export class TmssDatepickerMiniComponent extends TmssDatepickerComponent {
}
