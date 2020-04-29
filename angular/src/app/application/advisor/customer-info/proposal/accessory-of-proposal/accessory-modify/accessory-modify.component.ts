import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';

import { SetModalHeightService } from '../../../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../../../shared/loading/loading.service';
import { ToastService } from '../../../../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'accessory-modify',
  templateUrl: './accessory-modify.component.html',
  styleUrls: ['./accessory-modify.component.scss'],
})
export class AccessoryModifyComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @Output() add = new EventEmitter();
  @Output() modify = new EventEmitter();
  selectedData;
  form: FormGroup;
  modalHeight: number;
  fieldGridPartCode;
  parts: Array<any>;

  constructor(private modalHeightService: SetModalHeightService,
              private loadingService: LoadingService,
              private formBuilder: FormBuilder,
              private dataFormatService: DataFormatService,
              private swalAlertService: ToastService) {
    this.fieldGridPartCode = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partCode'},
      {headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', field: 'partName'},
      {headerName: 'PNC', headerTooltip: 'PNC', field: 'pnc'},
      {headerName: 'Đ/vị', headerTooltip: 'Đ/vị', field: 'unit'},
      {headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'price'},
      {headerName: 'Tồn', headerTooltip: 'Tồn', field: 'stock'},
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'tax'},
    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(parts, selectedData?) {
    this.parts = parts;
    this.selectedData = selectedData;
    this.onResize();
    this.modal.show();
    this.buildForm();
  }

  formatMoneyForm(field) {
    return this.dataFormatService.formatMoneyForm(this.form, field);
  }

  reset() {
    this.form = undefined;
  }

  getPartList() {
    return of([{
      partCode: 'DAIOC',
      partName: 'Dây cáp điện',
      pnc: 'OM100',
      unit: 'Cái',
      price: 300000,
      stock: 0,
      tax: 10,
    }, {
      partCode: '050',
      partName: 'Cánh quạt gió',
      pnc: 'OM200',
      unit: 'Bộ',
      price: 100000,
      stock: 0,
      tax: 10,
    }]);
  }

  countValue() {
    const formValue = this.form.getRawValue();
    const payment = this.dataFormatService.parseMoneyToValue(formValue.payment);
    this.form.patchValue({
      value: Math.ceil(payment * Number(formValue.percent) / 100),
    });
    this.formatMoneyForm('value');
  }

  countPercent() {
    const formValue = this.form.getRawValue();
    this.form.patchValue({
      percent: formValue.value ?
        Math.floor(this.dataFormatService.parseMoneyToValue(formValue.value) * 100 / this.dataFormatService.parseMoneyToValue(formValue.payment)) : 0,
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    if (!this.selectedData && this.parts.find(work => work.partCode === this.form.getRawValue().partCode)) {
      this.swalAlertService.openFailToast('Trùng mã phụ tùng');
      return;
    }

    this.selectedData ? this.modify.emit(this.form.getRawValue()) : this.add.emit(this.form.getRawValue());
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      partCode: [undefined],
      partName: [{value: undefined, disabled: true}],
      unit: [{value: undefined, disabled: true}],
      price: [{value: undefined, disabled: true}],
      stock: [{value: undefined, disabled: true}],
      required: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.required])],
      receive: [{value: undefined, disabled: true}],
      payment: [{value: undefined, disabled: true}],
      tax: [10],
      percent: [0, Validators.compose([GlobalValidator.maxLength(3), GlobalValidator.numberFormat])],
      value: [undefined, GlobalValidator.numberFormat],
      note: [undefined],
      ver: [undefined],
      fix: [undefined],
    });

    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }

    this.form.get('required').valueChanges.subscribe(val => {
      if (val) {
        const price = this.dataFormatService.parseMoneyToValue(this.form.getRawValue().price);
        this.form.get('payment').setValue(price * Number(val));
        this.formatMoneyForm('price');
        this.formatMoneyForm('payment');
      }
    });
  }

}
