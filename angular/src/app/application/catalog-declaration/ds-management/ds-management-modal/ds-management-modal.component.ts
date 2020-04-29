import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankApi } from '../../../../api/common-api/bank.api';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ModalDirective } from 'ngx-bootstrap';
import { McopperPaintApi } from '../../../../api/common-api/mcopper-paint.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ds-management-modal',
  templateUrl: './ds-management-modal.component.html',
  styleUrls: ['./ds-management-modal.component.scss'],
})
export class DsManagementModalComponent {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  modalHeight;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private bankCommonApi: BankApi,
    private mcopperPaintApi: McopperPaintApi,
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
    const obj = this.form.value;
    obj.status = obj.status === true ? 'Y' : 'N';
    const apiCall = !this.selectedData ?
      this.mcopperPaintApi.addMCopperPaint(obj) : this.mcopperPaintApi.updateMCopperPaint(obj);

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
      name: [undefined,
        Validators.compose([GlobalValidator.required, GlobalValidator.specialCharacter, GlobalValidator.maxLength(250)])],
      id: [{value: undefined, disabled: false}],
      color: ['#000000'],
      status: [true],
      description: [undefined],
      ordering: [undefined,
        Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat,  GlobalValidator.maxLength(10)])],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      this.form.patchValue({
        status: (this.selectedData.status === 'Y'),
      });
    }
  }
}
