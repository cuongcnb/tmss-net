import { FormGroup } from '@angular/forms';
import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[focusErrorField]'
})

export class FormFocusErrorFieldDirective implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('formGroup') form: FormGroup;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    const controlName = Object.keys(this.form.controls)[0];
    if (controlName) {
      this.focusField(controlName);
    }
  }

  @HostListener('submit', ['$event'])
  onSubmit(event) {
    if (this.form.valid) {
      return;
    }
    const controlNameError = Object.keys(this.form.controls).filter(key => this.form.controls[key].invalid)[0];
    if (controlNameError) {
      this.focusField(controlNameError);
    }
  }

  focusField(controlName) {
    const errorEle = this.elementRef.nativeElement.querySelector(`[formControlName="${controlName}"]`);
    if (errorEle) {
      errorEle.focus();
      errorEle.scrollIntoView({ behavior: 'smooth' });
    }
  }


}
