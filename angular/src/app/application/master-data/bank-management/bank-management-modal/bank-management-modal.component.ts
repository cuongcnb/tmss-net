import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankManagementService} from '../../../../api/master-data/bank-management.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { LookupService} from '../../../../api/lookup/lookup.service';
import { LookupCodes } from '../../../../core/constains/lookup-codes';
import { LookupDataModel } from '../../../../core/models/base.model';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bank-management-modal',
  templateUrl: './bank-management-modal.component.html',
  styleUrls: ['./bank-management-modal.component.scss']
})
export class BankManagementModalComponent {
  @ViewChild('bankManagementModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  modalHeight: number;
  bankTypes: Array<LookupDataModel>;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private lookupService: LookupService,
    private bankService: BankManagementService
  ) {
  }

  private getBankTypes() {
    this.loadingService.setDisplay(true);
    this.lookupService.getDataByCode(LookupCodes.bank_type).subscribe(bankTypes => {
      this.bankTypes = bankTypes;
      this.loadingService.setDisplay(false);
    });
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.onResize();
    this.getBankTypes();
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
      this.bankService.createNewBank(this.form.value) : this.bankService.updateBank(this.form.value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      bankCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      bankName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255)])],
      status: ['Y'],
      bankTypeId: [undefined],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      address: [undefined, GlobalValidator.maxLength(50)],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
