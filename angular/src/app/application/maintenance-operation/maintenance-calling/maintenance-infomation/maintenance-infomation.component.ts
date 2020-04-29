import { Component, Input, OnInit, SimpleChanges, OnChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalValidator } from '../../../../shared/form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'maintenance-infomation',
  templateUrl: './maintenance-infomation.component.html',
  styleUrls: ['./maintenance-infomation.component.scss']
})
export class MaintenanceInfomationComponent implements OnInit, OnChanges {
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
      dateTime: [undefined],
      errorCVDV: [undefined],
      errorKm: [undefined],
      repairContent: [undefined],
      sortAgency: [undefined],
    });
  }
}
