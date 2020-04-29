import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'infomation-share',
  templateUrl: './infomation-share.component.html',
  styleUrls: ['./infomation-share.component.scss']
})
export class InfomationShareComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      errorModel: [undefined],
      errorVin: [undefined],
      licensePlates: [undefined],
      errorName: [undefined],
      errorAddress: [undefined],
      errorCity: [undefined],
      errorPhone: [undefined, GlobalValidator.phoneFormat],
      errorEmail: [undefined, Validators.compose([GlobalValidator.emailFormat, GlobalValidator.maxLength(50)])],
      errorDistrict: [undefined],
      companyName: [undefined],
    });
  }

}
