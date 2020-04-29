import {Component, ViewChild, Output, EventEmitter, OnInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProvincesService} from '../../../../api/master-data/provinces.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {LookupService} from '../../../../api/lookup/lookup.service';
import {LookupCodes} from '../../../../core/constains/lookup-codes';
import {LookupDataModel} from '../../../../core/models/base.model';
import {ToastService} from '../../../../shared/common-service/toast.service';
import { ProvincesModel } from '../../../../core/models/sales/provinces.model';

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
              private provincesService: ProvincesService,
              private swalAlertService: ToastService,
              private lookupService: LookupService) {
  }

  private getRegions() {
    this.lookupService.getDataByCode(LookupCodes.regions).subscribe(regions => {
      this.regions = regions;
    });
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

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 && c1 === c2;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const apiCall = !this.selectedData ?
      this.provincesService.createNewProvinces(this.form.value) : this.provincesService.updateProvince(this.form.value);

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
