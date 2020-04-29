import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {FilterFormCode} from '../../../../core/constains/filter-form-code';
import {FirefoxDate} from '../../../../core/firefoxDate/firefoxDate';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delivery-filter-start-modal',
  templateUrl: './delivery-filter-start-modal.component.html',
  styleUrls: ['./delivery-filter-start-modal.component.scss']
})
export class DeliveryFilterStartModalComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedDate: Date;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private formStoringService: FormStoringService
  ) {
  }

  open() {
    this.buildForm();
    this.fillDatePicker();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  confirm() {
    const {saleDateFrom, saleDateTo} = this.form.value;
    if ((saleDateFrom && saleDateTo) && new FirefoxDate(saleDateFrom).getTime() >= new FirefoxDate(saleDateTo).getTime()) {
      this.swalAlertService.openFailModal('From Date must be less than To Date. Please check before submit', 'Invalid From Date and To Date');
      return;
    }
    this.formStoringService.set(StorageKeys.deliveryFilterStartModal, this.form.value);
    this.close.emit({
      form: this.form.value,
      type: FilterFormCode.delivery
    });
    this.modal.hide();
  }

  fillDatePicker(selectedDate?) {
    this.selectedDate = selectedDate ? new Date(selectedDate) : new Date();
    if (this.selectedDate) {
      const year = (new Date(this.selectedDate)).getFullYear();
      const month = (new Date(this.selectedDate)).getMonth();
      this.form.patchValue({
        saleDateFrom: new Date(year, month, 1),
        saleDateTo: new Date(year, month, new Date(year, month + 1, 0).getDate()),
      });
    }
  }


  private buildForm() {
    this.form = this.formBuilder.group({
      saleDateFrom: [undefined],
      saleDateTo: [undefined],
      frameNo: [undefined],
    });
  }
}


