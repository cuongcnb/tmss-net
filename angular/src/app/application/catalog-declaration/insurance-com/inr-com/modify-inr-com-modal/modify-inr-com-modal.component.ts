import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';

import { InsuranceComModel } from '../../../../../core/models/sales/insurance-company.model';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';
import { InsuranceServiceApi } from '../../../../../api/common-api/insurance-service.api';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';
import { BankApi } from '../../../../../api/common-api/bank.api';
import { BankModel } from '../../../../../core/models/common-models/bank-model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-inr-com-modal',
  templateUrl: './modify-inr-com-modal.component.html',
  styleUrls: ['./modify-inr-com-modal.component.scss']
})
export class ModifyInrComModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: InsuranceComModel;
  form: FormGroup;
  modalHeight: number;
  banks: Array<BankModel>;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private insuranceApi: InsuranceServiceApi,
    private bankApi: BankApi,
  ) {
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.onResize();
    this.getBanks();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const value = this.form.value;
    const apiCall = this.selectedData
      ? this.insuranceApi.update(value)
      : this.insuranceApi.create(value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      inrCCode: [undefined, [GlobalValidator.required, GlobalValidator.specialCharacter]],
      inrCName: [undefined, GlobalValidator.required],
      smicAdd: [undefined],
      website: [undefined],
      tel: [undefined, GlobalValidator.phoneFormat],
      fax: [undefined, GlobalValidator.phoneFormat],
      accno: [undefined, GlobalValidator.numberFormat],
      taxcode: [undefined, GlobalValidator.taxFormat],
      email: [undefined, GlobalValidator.emailFormat],
      pic: [undefined],
      picTel: [undefined, GlobalValidator.phoneFormat],
      remark: [undefined],
      bankId: [undefined],
      id: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }

  private getBanks() {
    this.loadingService.setDisplay(true);
    this.bankApi.getBanksByDealer().subscribe(res => {
      this.banks = res || [];
      this.loadingService.setDisplay(false);
    });
  }
}
