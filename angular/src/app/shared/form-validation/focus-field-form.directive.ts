import { FormArray, FormGroup } from '@angular/forms';
import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[focusField]',
})

export class FocusFieldFormDirective implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('formGroup') form: FormGroup;
  selector;
  found: boolean;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    const controlName = Object.keys(this.form.controls)[0];
    if (controlName) {
      setTimeout(() => {
        this.focusField(`[formControlName="${controlName}"]`, 0);
      }, 500);
    }

  }

  @HostListener('submit', ['$event'])
  onSubmit(event) {
    if (this.form.valid) {
      return;
    }
    this.found = false;
    this.findErrorField(this.form, '');
  }

  focusOnOpen() {
    this.selector = '';
    const controlName = Object.keys(this.form.controls)[0];
    if (controlName) {
      setTimeout(() => {
        this.focusField(`[formControlName="${controlName}"]`, 0);

      }, 500);
    }
  }

  focusField(controlName, i) {
    const element = this.elementRef.nativeElement.querySelectorAll(`${controlName}`);
    if (i < element.length && element[i] && !this.found) {
      if (element[i].attributes.fieldAccessor) {
        element[i].querySelector(element[i].attributes.fieldAccessor.value).focus();
      } else {
        element[i].focus();
      }
      element[i].scrollIntoView({behavior: 'smooth'});
      this.found = true;
    }
  }

  findErrorField(form: FormGroup, selector, index?) {
    index = index || 0;
    Object.keys(form.controls).forEach(key => {
        if (form.controls[key] instanceof FormArray) {
          const array = this.form.controls[key] as FormArray;
          for (let i = 0; i < array.controls.length; i++) {
            // selector += `[formControlName]="${key}" `
            this.findErrorField(array.controls[i] as FormGroup, selector + `[formArrayName="${key}"] `, i);
          }
        } else if (form.controls[key].invalid) {
          this.focusField(selector + `[formControlName="${key}"]`, index);
          return;
        }
      },
    );
  }

}
