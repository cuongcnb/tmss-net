import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'info-contact-after-days15',
  templateUrl: './info-contact-after-days15.component.html',
  styleUrls: ['./info-contact-after-days15.component.scss'],
})
export class InfoContactAfterDays15Component implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('notecontact', {static: false}) noteContact;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      isContactSuccessful: [undefined],
      contactNextBD: [{value: undefined, disabled: true}],
      contactCheck: [{value: undefined, disabled: true}],
      contactAppointmentDate: [{value: undefined, disabled: true}],
      contactAppointmentDateTo: [{value: undefined, disabled: true}],
      failedContactCheck: [{value: undefined, disabled: false}],
      contactDateTime: [{value: undefined, disabled: true}],
      isNote: [{value: undefined, disabled: true}],
    });
    const fieldEnable = [
      'contactCheck', 'contactNextBD', 'contactDateTime', 'isNote',
      'contactAppointmentDate', 'contactAppointmentDateTo'
    ];

    this.form.get('isContactSuccessful').valueChanges.subscribe(value => {
      if (value) {
        fieldEnable.forEach(field => this.form.get(field).enable());
        this.form.get('failedContactCheck').disable();
      } else {
        fieldEnable.forEach(field => this.form.get(field).disable());
        this.form.get('failedContactCheck').enable();
      }
    });
  }
}
