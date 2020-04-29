import { Directive, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[autoFocusField]'
})
export class AutoFocusDirective implements AfterViewInit {

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 500);
  }

}
