import { Directive, OnChanges, Input, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[tabDisplay]'
})
export class TabDisplayDirective implements OnChanges {
  @Input('tabDisplay') display;

  constructor(
    private elem: ElementRef
  ) { }

  ngOnChanges() {
    !this.display ? this.elem.nativeElement.classList.add('d-none') : this.elem.nativeElement.classList.remove('d-none');
  }
}
