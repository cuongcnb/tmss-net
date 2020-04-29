import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalValidator } from '../../../../shared/form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'info-after-days15',
  templateUrl: './info-after-days15.component.html',
  styleUrls: ['./info-after-days15.component.scss']
})
export class InfoAfterDays15Component implements OnInit, OnChanges {
  @Input() isContactAfterDays15: boolean;
  @Input() detailData: any;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.detailData) {
      this.form.patchValue(this.detailData);
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      errorTVBH: [undefined],
      dateTime: [undefined],
      licensePlates: [undefined],
      errorModel: [undefined],
      errorVin: [undefined],
      nextBD: [undefined],
      ownerName: [undefined],
      errorAddress: [undefined],
      errorAddressCompany: [undefined],
      errorAddressChil: [undefined],
      errorPhone: [undefined, GlobalValidator.phoneFormat],
      errorPhoneCompany: [undefined, GlobalValidator.phoneFormat],
      errorPhoneChil: [undefined, GlobalValidator.phoneFormat],
      errorEmail: [undefined, Validators.compose([GlobalValidator.emailFormat, GlobalValidator.maxLength(50)])],
      errorEmailChil: [undefined, Validators.compose([GlobalValidator.emailFormat, GlobalValidator.maxLength(50)])],
      companyName: [undefined],
      carCarrier: [undefined],
      errorContact: [undefined],
      errorStop: [undefined],
      errorTaxi: [undefined]
    });
  }
}
