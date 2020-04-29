import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TransportTypeService} from '../../../../api/master-data/transport-type.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-transportation-type-modal',
  templateUrl: './modify-transportation-type-modal.component.html',
  styleUrls: ['./modify-transportation-type-modal.component.scss']
})
export class ModifyTransportationTypeModalComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('forceErrorModal', {static: false}) forceErrorModal;
  @ViewChild('forceSuccessModal', {static: false}) forceSuccessModal;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedMeans;
  mtrId;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private modalHeightService: SetModalHeightService,
    private transportTypeService: TransportTypeService
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(mtrId?, selectedMeans?) {
    this.mtrId = mtrId;
    this.selectedMeans = selectedMeans;
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
      meanTransportationId: this.mtrId
    });
    const apiCall = !this.selectedMeans
      ? this.transportTypeService.createNewTransportType(value)
      : this.transportTypeService.updateTransportType(value);

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
      name: ['', Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      status: ['Y'],
      description: ['', GlobalValidator.maxLength(255)]
    });
    if (this.selectedMeans) {
      this.form.patchValue(this.selectedMeans);
    }

  }

}
