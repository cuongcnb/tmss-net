import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { YardManagementService} from '../../../../api/master-data/yard-management.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { LookupService} from '../../../../api/lookup/lookup.service';
import { LookupCodes } from '../../../../core/constains/lookup-codes';
import { LookupDataModel } from '../../../../core/models/base.model';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'yard-modify-modal',
  templateUrl: './yard-modify-modal.component.html',
  styleUrls: ['./yard-modify-modal.component.scss']
})
export class YardModifyModalComponent {
  @ViewChild('yardModifyModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  modalHeight: number;
  locations: Array<LookupDataModel>;

  constructor(
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private modalHeightService: SetModalHeightService,
    private yardManagementService: YardManagementService
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  private getLocations() {
    this.lookupService.getDataByCode(LookupCodes.yard_location).subscribe(locations => {
      this.locations = locations;
    });
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.onResize();
    this.getLocations();
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
      this.yardManagementService.createNewYard(this.form.value) : this.yardManagementService.updateYard(this.form.value);

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
      name: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      address: [undefined, GlobalValidator.maxLength(255)],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      yardLocationId: [undefined, GlobalValidator.required],
      status: ['Y'],
      description: [undefined, GlobalValidator.maxLength(2000)]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }

  }
}
