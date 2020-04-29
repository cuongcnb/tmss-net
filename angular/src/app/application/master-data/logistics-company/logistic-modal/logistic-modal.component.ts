import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LogisticsCompanyService} from '../../../../api/master-data/logistics-company.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { StorageKeys } from '../../../../core/constains/storageKeys';
import { FormStoringService } from '../../../../shared/common-service/form-storing.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'logistic-modal',
  templateUrl: './logistic-modal.component.html',
  styleUrls: ['./logistic-modal.component.scss']
})
export class LogisticModalComponent {
  @ViewChild('logisticModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private swalAlertService: ToastService,
    private formStoringService: FormStoringService,
    private logisticsCompanyService: LogisticsCompanyService,
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
    const apiCall = !this.selectedData
      ? this.logisticsCompanyService.createNewLogisticCompany(this.form.value)
      : this.logisticsCompanyService.updateLogisticCompany(this.form.value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.formStoringService.clear(StorageKeys.logistics);
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      code: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      vnName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      enName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      contactPerson: [undefined, GlobalValidator.maxLength(50)],
      status: ['Y'],
      taxCode: [undefined, GlobalValidator.taxFormat],
      bankNo: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(50)])],
      tel: [undefined, GlobalValidator.phoneFormat],
      fax: [undefined, GlobalValidator.phoneFormat],
      address: [undefined, GlobalValidator.maxLength(2000)],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    } else {
      const val = this.formStoringService.get(StorageKeys.logistics);
      if (val) {
        this.form.patchValue(val);
      }
    }
    this.form.valueChanges.subscribe(data => {
      if (data) {
        this.formStoringService.set(StorageKeys.logistics, data);
      }
    });
  }
}

