import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';

import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { DistrictOfProvinceModel } from '../../../../core/models/sales/district-list.model';
import { DistrictApi } from '../../../../api/sales-api/district/district.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'district-list-modal',
  templateUrl: './district-list-modal.component.html',
  styleUrls: ['./district-list-modal.component.scss']
})
export class DistrictListModalComponent {
  @ViewChild('districtListModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: DistrictOfProvinceModel;
  provinceId: string;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private modalHeightService: SetModalHeightService,
    private districtListService: DistrictApi
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(provinceId?: string, selectedData?) {
    this.selectedData = selectedData;
    this.provinceId = provinceId;
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

    const value = Object.assign({}, this.form.value, {
      provinceId: this.provinceId
    });

    const apiCall = !this.selectedData ?
      this.districtListService.createNewDistrict(value) : this.districtListService.updateDistrict(value);

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
      id: [undefined],
      code: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      name: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255)])],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      description: [undefined, GlobalValidator.maxLength(2000)],
      status: ['Y']
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
