import {Component, ViewChild, Output, EventEmitter} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {YardLocationService} from '../../../../api/master-data/yard-location.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {YardAreaService} from '../../../../api/master-data/yard-area.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'yard-location-modal',
  templateUrl: './yard-location-modal.component.html',
  styleUrls: ['./yard-location-modal.component.scss']
})
export class YardLocationModalComponent {
  @ViewChild('yardLocationModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  yardId: number;
  form: FormGroup;
  modalHeight: number;
  yardAreas;

  constructor(
              private yardLocationService: YardLocationService,
              private loadingService: LoadingService,
              private swalAlertService: ToastService,
              private modalHeightService: SetModalHeightService,
              private yardAreaService: YardAreaService,
              private formBuilder: FormBuilder) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  private getAreas() {
    this.loadingService.setDisplay(true);
    this.yardAreaService.getYardArea(this.yardId, true).subscribe(yardAreas => {
      this.yardAreas = yardAreas;
      this.loadingService.setDisplay(false);
    });
  }

  open(yardId: number, selectedData?) {
    this.selectedData = selectedData;
    this.yardId = yardId;
    this.getAreas();
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 === c2;
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const value = Object.assign({}, this.form.value, {
      yardId: this.yardId,
    });
    const apiCall = !this.selectedData
      ? this.yardLocationService.createNewYardLocation(value)
      : this.yardLocationService.updateYardLocation(value);

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
      locationRow: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      locationColumn: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      priority: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(6)])],
      status: ['Y'],
      areaId: [undefined],
      description: [undefined, GlobalValidator.maxLength(255)]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
