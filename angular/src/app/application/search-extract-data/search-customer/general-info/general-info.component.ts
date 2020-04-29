import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      licensePlates: [undefined],
      errorModel: [undefined],
      errorVin: [undefined],
      nextBD: [undefined],
      nextBDto: [undefined],
      ownerName: [undefined],
      errorAddress: [undefined],
      errorPhone: [undefined],
      errorEmail: [undefined],
      companyName: [undefined],
      errorAddressCompany: [undefined],
      errorPhoneCompany: [undefined],
      carCarrier: [undefined],
      errorAddressChil: [undefined],
      errorPhoneChil: [undefined],
      errorEmailChil: [undefined],
      errorContact: [undefined],
      requestKH: [undefined],
    });
  }
}
