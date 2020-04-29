import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { LookupCodes } from '../../../../core/constains/lookup-codes';
import { LookupDataModel } from '../../../../core/models/base.model';
import { ProvincesModel } from '../../../../core/models/sales/provinces.model';
import { ProvinceApi } from '../../../../api/sales-api/province/province.api';
import { LookupApi } from '../../../../api/sales-api/lookup/lookup.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'provinces-modal',
  templateUrl: './provinces-modal.component.html',
  styleUrls: ['./provinces-modal.component.scss']
})
export class ProvincesModalComponent {
  @ViewChild('provincesModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: ProvincesModel;
  form: FormGroup;
  regions: Array<LookupDataModel>;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private provinceApi: ProvinceApi,
    private swalAlertService: ToastService,
    private lookupApi: LookupApi) {
  }

  private getRegions() {
    this.lookupApi.getDataByCode(LookupCodes.regions).subscribe(regions => this.regions = regions);
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.onResize();
    this.getRegions();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const apiCall = !this.selectedData
      ? this.provinceApi.createNewProvinces(this.form.value)
      : this.provinceApi.updateProvince(this.form.value);

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
      populationAmount: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(12)])],
      squareAmount: [undefined, GlobalValidator.squareNumberValidate],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      status: ['Y', GlobalValidator.required],
      regionId: [undefined, GlobalValidator.required],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
