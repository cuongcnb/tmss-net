import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { EventBusService } from '../../../../shared/common-service/event-bus.service';
import { EventBusType } from '../../../../core/constains/eventBusType';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fleet-follow-up-filter',
  templateUrl: './fleet-follow-up-filter.component.html',
  styleUrls: ['./fleet-follow-up-filter.component.scss']
})
export class FleetFollowUpFilterComponent {
  @ViewChild('fleetFollowUpFilter', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedDate: Date;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private eventBusService: EventBusService,
  ) {}

  open() {
    this.buildForm();
    this.modal.show();
    this.fillDatePicker();
  }

  confirm() {
    this.loadingService.setDisplay(true);
    const { contractDateFrom, contractDateTo, expiryDateFrom, expiryDateTo, salesDateFrom, salesDateTo } = this.form.value;
    if (this.form.invalid) {
      return;
    } else if ((contractDateFrom && contractDateTo) && (contractDateFrom.getTime() >= contractDateTo.getTime())
      || (expiryDateFrom && expiryDateTo) && (expiryDateFrom.getTime() >= expiryDateTo.getTime())
      || (salesDateFrom && salesDateTo) && (salesDateFrom.getTime() >= salesDateTo.getTime())) {
      this.swalAlertService.openFailModal('From Date must be less than To Date. Please check before submit', 'Invalid From Date and To Date');
      return;
    }

    this.loadingService.setDisplay(false);
    this.eventBusService.emit({
      type: EventBusType.closeFleetFollowupFilterModal,
      value: []
    });
    this.close.emit();
    this.modal.hide();
  }


  fillDatePicker(selectedDate?) {
    this.selectedDate = selectedDate ? new Date(selectedDate) : new Date();
    if (this.selectedDate) {
      const year = (new Date(this.selectedDate)).getFullYear();
      const month = (new Date(this.selectedDate)).getMonth();
      this.form.patchValue({
        contractDateFrom: new Date(year, month, 1),
        expiryDateFrom: new Date(year, month, 1),
        salesDateFrom: new Date(year, month, 1),
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      contractDateFrom: [''],
      contractDateTo: [''],
      selectContractDate: true,
      expiryDateFrom: [''],
      expiryDateTo: [''],
      selectExpiryDate: true,
      salesDateFrom: [''],
      salesDateTo: [''],
      selectSalesDate: true,
      fleetCustomer: ['']
    });

    this.form.get('selectContractDate').valueChanges.subscribe(val => {
      if (val === false) {
        this.form.get('contractDateFrom').disable();
        this.form.get('contractDateTo').disable();
      } else {
        this.form.get('contractDateFrom').enable();
        this.form.get('contractDateTo').enable();
      }
    });
    this.form.get('selectExpiryDate').valueChanges.subscribe(val => {
      if (val === false) {
        this.form.get('expiryDateFrom').disable();
        this.form.get('expiryDateTo').disable();
      } else {
        this.form.get('expiryDateFrom').enable();
        this.form.get('expiryDateTo').enable();
      }
    });
    this.form.get('selectSalesDate').valueChanges.subscribe(val => {
      if (val === false) {
        this.form.get('salesDateFrom').disable();
        this.form.get('salesDateTo').disable();
      } else {
        this.form.get('salesDateFrom').enable();
        this.form.get('salesDateTo').enable();
      }
    });
  }
}
