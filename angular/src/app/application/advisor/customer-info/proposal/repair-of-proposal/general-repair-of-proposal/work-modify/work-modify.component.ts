import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetModalHeightService } from '../../../../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../../../../shared/loading/loading.service';
import { ToastService } from '../../../../../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../../../../../shared/confirmation/confirm.service';
import { of } from 'rxjs';
import { DataFormatService } from '../../../../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'work-modify',
  templateUrl: './work-modify.component.html',
  styleUrls: ['./work-modify.component.scss'],
})
export class WorkModifyComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @Input() isGeneralRepair: boolean;
  @Output() add = new EventEmitter();
  @Output() modify = new EventEmitter();
  selectedData;
  form: FormGroup;
  modalHeight: number;
  fieldGridWorkCode;
  fieldGridWorkRange;
  fieldGridWorkDiff;
  works: Array<any>;

  constructor(private modalHeightService: SetModalHeightService,
              private loadingService: LoadingService,
              private formBuilder: FormBuilder,
              private dataFormatService: DataFormatService,
              private swalAlertService: ToastService) {
    this.fieldGridWorkCode = [
      {headerName: 'Mã CV', headerTooltip: 'Mã công việc', field: 'workCode'},
      {headerName: 'Tên CV', headerTooltip: 'Tên công việc', field: 'workName'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'note'},
      {headerName: 'Đ/mức giờ công', headerTooltip: 'Đ/mức giờ công', field: 'dm'},
      {headerName: 'H công thực tế', headerTooltip: 'H công thực tế', field: 'tt'},
    ];
    this.fieldGridWorkDiff = [
      {headerName: 'Kiểu sơn', headerTooltip: 'Kiểu sơn', field: 'workDiff'},
    ];
    this.fieldGridWorkRange = [
      {headerName: 'Phạm vi', headerTooltip: 'Phạm vi', field: 'workRange'},
    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(works, selectedData?) {
    this.works = works;
    this.selectedData = selectedData;
    this.onResize();
    this.modal.show();
    this.buildForm();
  }

  getWorkDiffList() {
    return of([{
      workDiff: 'Công việc sơn 1',
    }, {
      workDiff: 'Công việc sơn 2',
    }, {
      workDiff: 'Công việc sơn 3',
    }]);
  }

  getWorkCodeRange() {
    return of([{
      workRange: 'Phạm vi 1',
    }, {
      workRange: 'Phạm vi 2',
    }]);
  }

  getWorkCodeList() {
    return of([{
      workCode: '001',
      workName: 'Engine',
      note: 'abc',
      dm: 1.2,
      tt: 1.5,
      hs: 1,
      payment: 300000,
      percent: 0,
    }, {
      workCode: '001',
      workName: 'Engine',
      note: 'abc',
      dm: 1.2,
      tt: 1.5,
      hs: 1,
      payment: 250000,
      percent: 0,
    }]);
  }

  formatMoneyForm(field) {
    return this.dataFormatService.formatMoneyForm(this.form, field);
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    if (!this.selectedData && this.works.find(work => work.workCode === this.form.value.workCode)) {
      this.swalAlertService.openFailToast('Trùng mã CV');
      return;
    }

    this.selectedData ? this.modify.emit(this.form.value) : this.add.emit(this.form.value);
    this.modal.hide();
  }

  countValue() {
    const formValue = this.form.value;
    const payment = this.dataFormatService.parseMoneyToValue(formValue.payment);
    this.form.patchValue({
      value: Math.ceil(payment * Number(formValue.percent) / 100),
    });
    this.formatMoneyForm('value');
  }

  countPercent() {
    const formValue = this.form.value;
    this.form.patchValue({
      percent: formValue.value ?
        Math.floor(this.dataFormatService.parseMoneyToValue(formValue.value) * 100 / this.dataFormatService.parseMoneyToValue(formValue.payment)) : 0,
    });
  }

  reset() {
    this.form = undefined;
  }

  private buildForm() {
    this.form = this.isGeneralRepair ? this.buildRepairControl() : this.buildDongsonControl();

    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }

    this.form.get('payment').valueChanges.subscribe(val => {
      // TODO
      this.form.get('tt').setValue(0.5);
      this.countValue();
    });

    const setZeroFields = ['hs', 'tt', 'dm'];
    const changeStatusFields = ['dm', 'hs', 'tt', 'workGroup', 'workCode', 'workRange', 'workDiff', 'dmvt', 'ttvt'];
    this.form.get('roType').valueChanges.subscribe(val => {
      if (val) {
        setZeroFields.forEach(field => this.form.get(field) && this.form.get(field).setValue(0));
        changeStatusFields.forEach(field => this.form.get(field) && this.form.get(field).disable());
      } else {
        changeStatusFields.forEach(field => this.form.get(field) && this.form.get(field).enable());
      }
    });
  }

  private buildRepairControl() {
    return this.formBuilder.group({
      ...this.buildCommonControl().controls,
      hs: [undefined, GlobalValidator.floatNumberFormat],
    });
  }

  private buildDongsonControl() {
    return this.formBuilder.group({
      ...this.buildCommonControl().controls,
      workGroup: [undefined, GlobalValidator.required],
      workRange: [undefined],
      workDiff: [undefined],
      dmvt: [undefined, GlobalValidator.floatNumberFormat],
      ttvt: [undefined, GlobalValidator.floatNumberFormat],
    });
  }

  private buildCommonControl() {
    return this.formBuilder.group({
      id: [undefined],
      workCode: [undefined],
      workName: [undefined, GlobalValidator.required],
      roType: [undefined],
      dm: [undefined, GlobalValidator.floatNumberFormat],
      tt: [undefined, GlobalValidator.floatNumberFormat],
      payment: [undefined, GlobalValidator.required],
      tax: [10],
      percent: [0, Validators.compose([GlobalValidator.maxLength(3), GlobalValidator.numberFormat])],
      value: [undefined, GlobalValidator.numberFormat],
      note: [undefined],
      ver: [undefined],
      fix: [undefined],
    });
  }

}
