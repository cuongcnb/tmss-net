import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsuranceCompanyService} from '../../../../api/master-data/insurance-company.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { FormStoringService } from '../../../../shared/common-service/form-storing.service';
import { StorageKeys } from '../../../../core/constains/storageKeys';
import { ToastService } from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'insurance-company-modal',
  templateUrl: './insurance-company-modal.component.html',
  styleUrls: ['./insurance-company-modal.component.scss']
})
export class InsuranceCompanyModalComponent {
  @ViewChild('insuranceCompanyModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private formStoringService: FormStoringService,
    private insuranceCompanyService: InsuranceCompanyService,
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.onResize();
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
      ? this.insuranceCompanyService.updateInsurance(value)
      : this.insuranceCompanyService.createNewInsurance(value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.formStoringService.clear(StorageKeys.insurance);
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
      vnName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255)])],
      enName: [undefined, GlobalValidator.maxLength(255)],
      contactPerson: [undefined, GlobalValidator.maxLength(50)],
      status: ['Y'],
      tel: [undefined, GlobalValidator.phoneFormat],
      fax: [undefined, GlobalValidator.phoneFormat],
      taxCode: [undefined, GlobalValidator.taxFormat],
      bankNo: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(50)])],
      address: [undefined, GlobalValidator.maxLength(2000)],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    } else {
      const val = this.formStoringService.get(StorageKeys.insurance);
      if (val) {
        this.form.patchValue(val);
      }
    }
    this.form.valueChanges.subscribe(data => {
      if (data) {
        this.formStoringService.set(StorageKeys.insurance, data);
      }
    });
  }

}
