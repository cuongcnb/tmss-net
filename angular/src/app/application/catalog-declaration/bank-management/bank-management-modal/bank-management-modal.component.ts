import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { BankModel } from '../../../../core/models/common-models/bank-model';
import { BankApi } from '../../../../api/common-api/bank.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bank-management-modal',
  templateUrl: './bank-management-modal.component.html',
  styleUrls: ['./bank-management-modal.component.scss']
})
export class BankManagementModalComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: BankModel;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private bankCommonApi: BankApi
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.onResize();
    this.buildForm();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const apiCall = !this.selectedData ?
      this.bankCommonApi.create(this.form.value) : this.bankCommonApi.update(this.form.value);

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
      bankCode: [undefined,
        Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(20), GlobalValidator.specialCharacter])],
      id: [undefined],
      bankName: [undefined,
        Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50), GlobalValidator.specialCharacter])],
      email: [undefined, Validators.compose([GlobalValidator.emailFormat, GlobalValidator.maxLength(50)])],
      fax: [undefined, GlobalValidator.phoneFormat],
      tel: [undefined, GlobalValidator.phoneFormat],
      bankAdd: [undefined, GlobalValidator.maxLength(100)],
      status: ['Y'],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
