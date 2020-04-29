import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import { InsuranceEmpModel } from '../../../../../core/models/sales/insurance-company.model';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';
import { InsuranceNewEmpApi } from '../../../../../api/sales-api/insurance-new-emp.api/insurance-new-emp.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-inr-emp-modal',
  templateUrl: './modify-inr-emp-modal.component.html',
  styleUrls: ['./modify-inr-emp-modal.component.scss']
})
export class ModifyInrEmpModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  form: FormGroup;
  inrComId: InsuranceEmpModel;
  selectedData: InsuranceEmpModel;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private insuranceEmpApi: InsuranceNewEmpApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
  ) {
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(inrComId, selectedData?) {
    this.onResize();
    this.inrComId = inrComId;
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const formValue = Object.assign({}, this.form.value, {inrComId: this.inrComId});
    const apiCall = this.selectedData
      ? this.insuranceEmpApi.update(formValue)
      : this.insuranceEmpApi.create(formValue);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
    });
  }

  reset() {
    this.form = undefined;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255), GlobalValidator.specialCharacter])],
      tel: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.phoneFormat])],
      inrComId: [undefined],
      id: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
