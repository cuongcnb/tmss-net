import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelListService} from '../../../../api/master-data/model-list.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'model-list-modal',
  templateUrl: './model-list-modal.component.html',
  styleUrls: ['./model-list-modal.component.scss']
})
export class ModelListModalComponent {
  @ViewChild('modelListModal', {static: false}) modal: ModalDirective;
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
    private modelListService: ModelListService
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
      ? this.modelListService.createNewModel(this.form.value)
      : this.modelListService.updateModel(this.form.value);
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
      marketingCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      productionCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      enName: [undefined, GlobalValidator.maxLength(50)],
      vnName: [undefined, GlobalValidator.maxLength(50)],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      status: ['Y', GlobalValidator.required],
      description: [undefined, GlobalValidator.maxLength(255)]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }

  }
}
