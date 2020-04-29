import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { YardAreaService} from '../../../../api/master-data/yard-area.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'yard-area-modal',
  templateUrl: './yard-area-modal.component.html',
  styleUrls: ['./yard-area-modal.component.scss']
})
export class YardAreaModalComponent {
  @ViewChild('yardAreaModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  yardId;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private yardAreaService: YardAreaService,
    private swalAlertService: ToastService,
    private modalHeightService: SetModalHeightService,
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(yardId?, selectedData?) {
    this.selectedData = selectedData;
    this.yardId = yardId;
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
    const value = Object.assign({}, this.form.value, {
      yardId: this.yardId
    });
    const apiCall = !this.selectedData
      ? this.yardAreaService.createNewYardArea(value)
      : this.yardAreaService.updateYardArea(value);

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
      name: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      status: ['Y'],
      description: [undefined, GlobalValidator.maxLength(2000)]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
