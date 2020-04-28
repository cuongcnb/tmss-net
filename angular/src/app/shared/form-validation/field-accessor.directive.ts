import { Directive, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[fieldAccessor]',
})

export class FieldAccessorDirective {
  @Input('fieldAccessor') accessor;

  constructor() {
  }
}
