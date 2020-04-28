import { FormControl } from '@angular/forms';
import { Directive, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[preventKeyup]',
})

export class PreventKeyupFormControlDirective implements OnInit {
  @Input('preventKeyup') controls: FormControl;
  selector;

  constructor() {
  }

  ngOnInit() {}

  @HostListener('input', ['$event'])
  onInput() {
    this.controls.setValue('');
  }
}
