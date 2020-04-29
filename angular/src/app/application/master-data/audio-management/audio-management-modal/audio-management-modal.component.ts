import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AudioManagementService} from '../../../../api/master-data/audio-management.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'audio-management-modal',
  templateUrl: './audio-management-modal.component.html',
  styleUrls: ['./audio-management-modal.component.scss']
})
export class AudioManagementModalComponent {
  @ViewChild('audioManagementModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private audioManagementService: AudioManagementService,
    private swalAlertService: ToastService,
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.onResize();
    this.selectedData = selectedData;
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
      ? this.audioManagementService.createNewAudio(this.form.value)
      : this.audioManagementService.updateAudio(this.form.value);

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
      ordering: [undefined, Validators.compose([GlobalValidator.maxLength(4), GlobalValidator.numberFormat])],
      status: ['Y', GlobalValidator.required],
      description: [undefined, GlobalValidator.maxLength(255)],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }

  }
}
