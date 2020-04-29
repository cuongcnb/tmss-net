import {Component, ViewChild, Output, EventEmitter, OnInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {FilterFormCode} from '../../../../core/constains/filter-form-code';
import {FirefoxDate} from '../../../../core/firefoxDate/firefoxDate';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contract-filter-start-modal',
  templateUrl: './contract-filter-start-modal.component.html',
  styleUrls: ['./contract-filter-start-modal.component.scss']
})
export class ContractFilterStartModalComponent implements OnInit {
  @ViewChild('defaultFilterModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private formStoringService: FormStoringService,
    private setModalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open() {
    this.buildForm();
    this.modal.show();
    this.fillDatePicker(new Date());
  }

  reset() {
    this.form = undefined;
  }

  confirm() {
    // this.loadingService.setDisplay(true);
    const {fromDepositDate, toDepositDate, fromCancelDate, toCancelDate, fromSalesDate, toSalesDate} = this.form.value;
    if (this.form.invalid) {
      return;
    } else if ((fromDepositDate && toDepositDate) && ((new FirefoxDate(fromDepositDate)).getTime() >= (new FirefoxDate(toDepositDate)).getTime())
      || (fromCancelDate && toCancelDate) && ((new FirefoxDate(fromCancelDate)).getTime() >= (new FirefoxDate(toCancelDate)).getTime())
      || (fromSalesDate && toSalesDate) && ((new FirefoxDate(fromSalesDate)).getTime() >= (new FirefoxDate(toSalesDate)).getTime())) {
      // this.loadingService.setDisplay(false);
      this.swalAlertService.openFailModal('From Date must be less than To Date. Please check before submit', 'Invalid From Date and To Date');
      return;
    }

    const filterParams = {
      filterContract: this.form.value,
      filterDataList: []
    };
    this.formStoringService.set(StorageKeys.contractFilterStartModal, filterParams);
    this.close.emit({
      form: filterParams,
      type: FilterFormCode.contract
    });
    this.modal.hide();
  }

  fillDatePicker(date) {
    if (date) {
      const year = (new Date(date)).getFullYear();
      const month = (new Date(date)).getMonth();
      this.form.patchValue({
        fromDepositDate: new Date(year, month, 1),
        fromCancelDate: new Date(year, month, 1),
        fromSalesDate: new Date(year, month, 1),

        toDepositDate: new Date(year, month, new Date(year, month + 1, 0).getDate()),
        toCancelDate: new Date(year, month, new Date(year, month + 1, 0).getDate()),
        toSalesDate: new Date(year, month, new Date(year, month + 1, 0).getDate())
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      fromDepositDate: [undefined],
      toDepositDate: [undefined],
      selectDepositDate: true,
      fromCancelDate: [undefined],
      toCancelDate: [undefined],
      selectCancelDate: true,
      fromSalesDate: [undefined],
      toSalesDate: [undefined],
      selectSalesDate: true,
      frameNo: [undefined],
      remainContract: true,
      onlyWaiting: false,
      endCustomer: false,
      month: [new Date()]
    });

    this.form.get('selectDepositDate').valueChanges.subscribe(val => {
      if (val === false) {
        this.form.get('fromDepositDate').disable();
        this.form.get('toDepositDate').disable();
      } else {
        this.form.get('fromDepositDate').enable();
        this.form.get('toDepositDate').enable();
      }
    });
    this.form.get('month').valueChanges.subscribe(val => {
      if (val) {
        this.fillDatePicker(val);
      } else {
        this.fillDatePicker(new Date());
      }
    });
    this.form.get('selectCancelDate').valueChanges.subscribe(val => {
      if (val === false) {
        this.form.get('fromCancelDate').disable();
        this.form.get('toCancelDate').disable();
      } else {
        this.form.get('fromCancelDate').enable();
        this.form.get('toCancelDate').enable();
      }
    });
    this.form.get('selectSalesDate').valueChanges.subscribe(val => {
      if (val === false) {
        this.form.get('fromSalesDate').disable();
        this.form.get('toSalesDate').disable();
      } else {
        this.form.get('fromSalesDate').enable();
        this.form.get('toSalesDate').enable();
      }
    });

    const remainContract = this.form.get('remainContract');
    const onlyWaiting = this.form.get('onlyWaiting');
    remainContract.valueChanges.subscribe(val => {
      if (val) {
        this.form.patchValue({onlyWaiting: false});
      }
    });
    onlyWaiting.valueChanges.subscribe(val => {
      if (val) {
        this.form.patchValue({
          remainContract: false,
          selectSalesDate: false,
          selectCancelDate: false,
          selectDepositDate: false,
        });
      }
    });
  }
}
