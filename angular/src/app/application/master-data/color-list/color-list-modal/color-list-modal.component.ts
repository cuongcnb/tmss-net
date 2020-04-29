import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { ColorListService} from '../../../../api/master-data/color-list.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'color-list-modal',
  templateUrl: './color-list-modal.component.html',
  styleUrls: ['./color-list-modal.component.scss']
})
export class ColorListModalComponent {
  @ViewChild('colorListModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private colorService: ColorListService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
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

    const apiCall = this.selectedData ?
      this.colorService.updateColor(this.form.value) : this.colorService.createNewColor(this.form.value);

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
      vnName: [undefined, GlobalValidator.maxLength(50)],
      enName: [undefined, GlobalValidator.maxLength(50)],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      status: ['Y'],
      description: [undefined, GlobalValidator.maxLength(255)],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
