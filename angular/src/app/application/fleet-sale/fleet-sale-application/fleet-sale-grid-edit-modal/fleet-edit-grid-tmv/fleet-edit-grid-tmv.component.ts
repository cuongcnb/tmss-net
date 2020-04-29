import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';
import {ToastService} from '../../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fleet-edit-grid-tmv',
  templateUrl: './fleet-edit-grid-tmv.component.html',
  styleUrls: ['./fleet-edit-grid-tmv.component.scss']
})
export class FleetEditGridTmvComponent implements OnInit {
  @ViewChild('fleetEditGridTmv', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedFleetApp;
  selectedIntentionOrDelivery;
  gradeList;
  colorList;
  isIntentionTable: boolean;
  monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService
  ) {
  }

  ngOnInit() {
  }

  open(isIntentionTable: boolean, selectedIntentionOrDelivery?) {
    this.isIntentionTable = isIntentionTable;
    this.selectedIntentionOrDelivery = selectedIntentionOrDelivery ? selectedIntentionOrDelivery : undefined;
    this.modal.show();
    this.buildForm();
  }

  reset() {
    this.form = undefined;
  }

  get getYearList() {
    const tenYearsFromNow = [];
    for (let i = 0; i <= 30; i++) {
      tenYearsFromNow.push(new Date().getFullYear() + i);
    }
    return tenYearsFromNow;
  }

  confirm() {
    if (this.form.invalid) {
      return;
    }
    const emmitValue = this.selectedIntentionOrDelivery;
    if (this.isIntentionTable) {
      emmitValue.frsp = this.form.value.frsp.replace(/[^\d.-]/g, '');
      emmitValue.fwsp = this.form.value.fwsp.replace(/[^\d.-]/g, '');
      emmitValue.discount = this.form.value.discount ? this.form.value.discount.replace(/[^\d.-]/g, '') : '';
    } else {
      const lastDayOfMonth = new Date(this.form.value.yearTmv, this.form.value.monthTmv, 0).getDate();
      if (new Date(this.form.value.yearTmv, this.form.value.monthTmv - 1, lastDayOfMonth) < new Date()) {
        this.swalAlertService.openFailModal('Selected Delivery Time is in the past, please select another time');
        return;
      }
      emmitValue.quantityTmv = this.form.value.quantityTmv;
      emmitValue.monthTmv = this.form.value.monthTmv;
      emmitValue.yearTmv = this.form.value.yearTmv;
    }
    this.close.emit(emmitValue);
    this.modal.hide();
  }

  private buildForm() {
    const frsp = this.selectedIntentionOrDelivery && this.selectedIntentionOrDelivery.frsp ? this.selectedIntentionOrDelivery.frsp : undefined;
    const fwsp = this.selectedIntentionOrDelivery && this.selectedIntentionOrDelivery.fwsp ? this.selectedIntentionOrDelivery.fwsp : undefined;
    const discount = this.selectedIntentionOrDelivery && this.selectedIntentionOrDelivery.discount ? this.selectedIntentionOrDelivery.discount : undefined;

    const quantityTmv = this.selectedIntentionOrDelivery && this.selectedIntentionOrDelivery.quantityTmv ? this.selectedIntentionOrDelivery.quantityTmv : undefined;
    const monthTmv = this.selectedIntentionOrDelivery && this.selectedIntentionOrDelivery.monthTmv ? this.selectedIntentionOrDelivery.monthTmv : undefined;
    const yearTmv = this.selectedIntentionOrDelivery && this.selectedIntentionOrDelivery.yearTmv ? this.selectedIntentionOrDelivery.yearTmv : undefined;
    this.form = this.formBuilder.group({
      frsp: [{ value: frsp, disabled: !this.isIntentionTable }, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      fwsp: [{ value: fwsp, disabled: !this.isIntentionTable }, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      discount: [{ value: discount, disabled: !this.isIntentionTable }, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(8)])],
      quantityTmv: [
        { value: quantityTmv, disabled: this.isIntentionTable },
        Validators.compose([
          GlobalValidator.required, GlobalValidator.numberFormat, GlobalValidator.maxLength(5)]
        )],
      monthTmv: [{ value: monthTmv, disabled: this.isIntentionTable }, GlobalValidator.required],
      yearTmv: [{ value: yearTmv, disabled: this.isIntentionTable }, GlobalValidator.required],
    });
  }

}
