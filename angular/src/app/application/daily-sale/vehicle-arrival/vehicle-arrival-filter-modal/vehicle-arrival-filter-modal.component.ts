import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {FilterFormCode} from '../../../../core/constains/filter-form-code';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vehicle-arrival-filter-modal',
  templateUrl: './vehicle-arrival-filter-modal.component.html',
  styleUrls: ['./vehicle-arrival-filter-modal.component.scss']
})
export class VehicleArrivalFilterModalComponent implements OnInit {
  @ViewChild('defaultFilterModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService,
    private swalAlertService: ToastService,
    private formStoringService: FormStoringService,
    private dataFormatService: DataFormatService,
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
    const {allocationMonthFrom, allocationMonthTo, dlrArrivalDateFrom, dlrArrivalDateTo, actualInvoiceDateFrom, actualInvoiceDateTo} = this.form.value;
    if ((allocationMonthFrom && allocationMonthTo) && ((new Date(allocationMonthFrom)).getTime() >= (new Date(allocationMonthTo)).getTime())
      || (dlrArrivalDateFrom && dlrArrivalDateTo) && ((new Date(dlrArrivalDateFrom)).getTime() >= (new Date(dlrArrivalDateTo)).getTime())
      || (actualInvoiceDateFrom && actualInvoiceDateTo) && ((new Date(actualInvoiceDateFrom)).getTime() >= (new Date(actualInvoiceDateTo)).getTime())) {
      this.swalAlertService.openFailModal('From Date must be less than To Date. Please check before submit', 'Invalid From Date and To Date');
      return;
    }
    this.formStoringService.set(StorageKeys.vehicleArrivalFilterStart, this.form.value);
    this.form.value.allocationMonthFrom = this.dataFormatService.formatDateSale(this.form.value.allocationMonthFrom);
    this.form.value.allocationMonthTo = this.dataFormatService.formatDateSale(this.form.value.allocationMonthTo);
    this.close.emit({
      form: this.form.value,
      type: FilterFormCode.vehicleArrival
    });
    this.modal.hide();
  }


  fillDatePicker(selectedDate) {
    if (selectedDate) {
      const year = (new Date(selectedDate)).getFullYear();
      const month = (new Date(selectedDate)).getMonth();
      this.form.patchValue({
        allocationMonthFrom: new Date(year, month, 1),
        dlrArrivalDateFrom: new Date(year, month, 1),
        actualInvoiceDateFrom: new Date(year, month, 1),

        allocationMonthTo: new Date(year, month, new Date(year, month + 1, 0).getDate()),
        dlrArrivalDateTo: new Date(year, month, new Date(year, month + 1, 0).getDate()),
        actualInvoiceDateTo: new Date(year, month, new Date(year, month + 1, 0).getDate())
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      allocationMonthFrom: [{value: undefined, disabled: true}],
      allocationMonthTo: [{value: undefined, disabled: true}],
      selectAllocationMonth: false,
      dlrArrivalDateFrom: [{value: undefined, disabled: true}],
      dlrArrivalDateTo: [{value: undefined, disabled: true}],
      selectDlrArrivalDate: false,
      actualInvoiceDateFrom: [undefined],
      actualInvoiceDateTo: [undefined],
      selectActualInvoiceDate: true,
      frameNo: [undefined],
      includeStockVehicle: true,

      month: [new Date()]
    });

    this.form.get('selectAllocationMonth').valueChanges.subscribe(val => {
      if (val === false) {
        this.form.get('allocationMonthFrom').disable();
        this.form.get('allocationMonthTo').disable();
      } else {
        this.form.get('allocationMonthFrom').enable();
        this.form.get('allocationMonthTo').enable();
      }
    });

    this.form.get('month').valueChanges.subscribe(val => {
      if (val) {
        this.fillDatePicker(val);
      }
    });
    this.form.get('selectDlrArrivalDate').valueChanges.subscribe(val => {
      if (val === false) {
        this.form.get('dlrArrivalDateFrom').disable();
        this.form.get('dlrArrivalDateTo').disable();
      } else {
        this.form.get('dlrArrivalDateFrom').enable();
        this.form.get('dlrArrivalDateTo').enable();
      }
    });
    this.form.get('selectActualInvoiceDate').valueChanges.subscribe(val => {
      if (val === false) {
        this.form.get('actualInvoiceDateFrom').disable();
        this.form.get('actualInvoiceDateTo').disable();
      } else {
        this.form.get('actualInvoiceDateFrom').enable();
        this.form.get('actualInvoiceDateTo').enable();
      }
    });
  }
}
