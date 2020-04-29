import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'successful-contact',
  templateUrl: './successful-contact.component.html',
  styleUrls: ['./successful-contact.component.scss'],
})
export class SuccessfulContactComponent implements OnInit {
  @ViewChild('contactNote', {static: false}) contactNote;
  @Output() isContactSuccessful = new EventEmitter();
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      isContactSuccessful: undefined,
      updateKm: [{value: undefined, disabled: true}],
      forgetKm: [{value: undefined, disabled: true}],
      nextBD: [{value: undefined, disabled: true}],
      dateTime: [{value: undefined, disabled: true}],
      carSale: [{value: undefined, disabled: true}],
      transferWork: [{value: undefined, disabled: true}],
      errorCVDV: [{value: undefined, disabled: true}],
      customersComplained: [{value: undefined, disabled: true}],
      callContent: [{value: undefined, disabled: true}],
      checkCall: [{value: undefined, disabled: false}],
      isNote: [{value: undefined, disabled: true}],
    });

    const fieldEnable = ['updateKm', 'forgetKm', 'isNote', 'nextBD', 'dateTime', 'carSale', 'transferWork', 'errorCVDV', 'customersComplained', 'callContent'];

    this.form.get('isContactSuccessful').valueChanges.subscribe(value => {
      if (value) {
        fieldEnable.forEach(field => {
          this.form.get(field).enable();
        });
        this.form.get('checkCall').disable();
      } else {
        fieldEnable.forEach(field => {
          this.form.get(field).disable();
        });
        this.form.get('checkCall').enable();
      }
    });
  }
}
