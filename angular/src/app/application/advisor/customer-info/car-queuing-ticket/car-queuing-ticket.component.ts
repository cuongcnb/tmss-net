import {Component, EventEmitter, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RepairOrderApi} from '../../../../api/quotation/repair-order.api';
import {DownloadService} from '../../../../shared/common-service/download.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {CustomerApi} from '../../../../api/customer/customer.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'car-queuing-ticket',
  templateUrl: './car-queuing-ticket.component.html',
  styleUrls: ['./car-queuing-ticket.component.scss']
})
export class CarQueuingTicketComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('btn', {static: false}) btn: ElementRef;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  modalHeight: number;
  customerId;
  cusVsId;
  vehiclesId;
  customerD;
  vhcType;

  constructor(private formBuilder: FormBuilder,
              private modalHeightService: SetModalHeightService,
              private repairOrderApi: RepairOrderApi,
              private downloadService: DownloadService,
              private loadingService: LoadingService,
              private customerApi: CustomerApi,
              private el: ElementRef) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(customerId, vehiclesId, customerD, cusVsId, vhcType) {
    this.customerId = customerId;
    this.vehiclesId = vehiclesId;
    this.cusVsId = cusVsId;
    this.customerD = customerD;
    this.vhcType = vhcType;
    this.buildForm();
    this.modal.show();
    setTimeout(() => {
      this.btn.nativeElement.focus();
    }, 200);
  }

  reset() {
    this.form = undefined;
  }

  print() {
    if (this.form.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    this.repairOrderApi.printRepairChecklist(Object.assign({}, this.form.value, {
      cusDId: this.form.value.id,
      cusVsId: this.cusVsId,
      carType: this.vhcType
    })).subscribe((data) => {
        this.customerApi.getLastCustomerCusvisitData({
          customerId: this.customerId,
          vehiclesId: this.vehiclesId,
          carModel: this.vhcType
        }).subscribe(val => {
          if (data) {
            this.downloadService.downloadFile(data);
          }
          this.modal.hide();
          this.close.emit(val);
          this.loadingService.setDisplay(false);
        });
      }
    );
  }

  private buildForm() {

    this.form = this.formBuilder.group({
      meetCus: [new Date()],
      timeCheck: [undefined],
      vehiclesId: [this.vehiclesId],
      customersId: [this.customerId],
      customerD: [this.customerD],
      extension: ['doc']
    });
    this.form.get('timeCheck').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('meetCus').setValue(new Date());
      }
    });
  }

}
