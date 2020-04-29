import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {FilterFormCode} from '../../../../core/constains/filter-form-code';
import {FirefoxDate} from '../../../../core/firefoxDate/firefoxDate';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cbu-filter-start-modal',
  templateUrl: './cbu-filter-start-modal.component.html',
  styleUrls: ['./cbu-filter-start-modal.component.scss'],
})
export class CbuFilterStartModalComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  @Input() isCbuFilterModal: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private formStoringService: FormStoringService,
    private swalAlertService: ToastService,
  ) {
  }

  open() {
    this.buildForm(this.isCbuFilterModal
      ? this.formStoringService.get('TMSS_CbuFilterStartModal')
      : this.formStoringService.get('TMSS_CkdFilterStartModal'));
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  confirm() {
    const {dateFrom, dateTo} = this.form.value;
    if (new FirefoxDate(dateFrom).getTime() > new FirefoxDate(dateTo).getTime()) {
      this.swalAlertService.openFailModal('From Date must be less than To Date. Please check before submit', 'Invalid From Date and To Date');
      return;
    }
    this.isCbuFilterModal
      ? this.formStoringService.set('TMSS_CbuFilterStartModal', this.form.value)
      : this.formStoringService.set('TMSS_CkdFilterStartModal', this.form.value);
    this.close.emit({
      form: this.form.value,
      type: this.isCbuFilterModal ? FilterFormCode.cbuVehicleInfo : FilterFormCode.ckdVehicleInfo
    });
    this.modal.hide();
  }

  private buildForm(oldFilter?) {
    const date = (new Date()).getDate();
    const month = (new Date()).getMonth();
    const year = (new Date()).getFullYear();
    this.form = this.formBuilder.group({
      formName: [this.isCbuFilterModal ? 'cbu' : 'ckd'],
      filterAll: [false],
      fieldName: [this.isCbuFilterModal ? 'Payment Date' : 'Painln Date'],
      dateFrom: [new Date(year, month, date)],
      dateTo: [new Date(year, month + 1, date)],
      blank: [true],
      frameNo: [undefined]
    });
    this.form.get('filterAll').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('fieldName').disable();
        this.form.get('dateFrom').disable();
        this.form.get('dateTo').disable();
        this.form.get('blank').disable();
      } else {
        this.form.get('fieldName').enable();
        this.form.get('dateFrom').enable();
        this.form.get('dateTo').enable();
        this.form.get('blank').enable();
      }
    });
    if (oldFilter) {
      this.form.patchValue(oldFilter);
      this.form.patchValue({
        dateFrom: new Date(oldFilter.dateFrom ? oldFilter.dateFrom : new Date()),
        dateTo: new Date(oldFilter.dateTo
          ? oldFilter.dateTo
          : new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, (new Date()).getDate())),
      });
    }
  }
}
