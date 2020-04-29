import {Component, EventEmitter, OnInit, Output, ViewChild, Input} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {FleetCustomerService} from '../../../../api/fleet-sale/fleet-customer.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fleet-customer-select-modal',
  templateUrl: './fleet-customer-select-modal.component.html',
  styleUrls: ['./fleet-customer-select-modal.component.scss']
})
export class FleetCustomerSelectModalComponent implements OnInit {
  @ViewChild('fleetCustomerSelectModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Input() fleetCustomers;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  fieldGridFleetCustomer;
  fleetCustomerParams;
  selectedFleetCustomer;
  isFleetCustomerId: boolean;

  constructor(
    private loadingService: LoadingService,
    private fleetCustomerService: FleetCustomerService
  ) {
    this.fieldGridFleetCustomer = [
      {field: 'code', minWidth: 140},
      {field: 'name', minWidth: 260},
      {field: 'address', minWidth: 150},
      {field: 'phone', minWidth: 100},
      {field: 'fax', minWidth: 100},
      {field: 'email', minWidth: 150},
      {field: 'contactPerson', minWidth: 100},
      {headerName: 'Contact Address', field: 'contactPersonAddress', minWidth: 150},
      {headerName: 'Contact Phone', field: 'contactPersonPhone', minWidth: 150},
    ];
  }

  ngOnInit() {
  }

  open(isFleetCustomerId?) {
    this.isFleetCustomerId = isFleetCustomerId;
    this.modal.show();
  }

  callbackGridFleetCustomer(params) {
    this.loadingService.setDisplay(true);
    this.fleetCustomerService.getAllFleetCustomer().subscribe(fleetCustomers => {
      this.fleetCustomers = fleetCustomers;
      params.api.setRowData(this.fleetCustomers);
      const allColumnIds = [];
      params.columnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));
      setTimeout(() => {
        params.columnApi.autoSizeColumns(allColumnIds);
      });
      this.loadingService.setDisplay(false);
    });
    this.fleetCustomerParams = params;
    // this.refreshFleetCustomer();
  }

  getParamsFleetCustomer() {
    const selectedFleetCustomer = this.fleetCustomerParams.api.getSelectedRows();
    if (selectedFleetCustomer) {
      this.selectedFleetCustomer = selectedFleetCustomer[0];
    }
  }

  refreshFleetCustomer() {
    this.fleetCustomerParams.api.setRowData(this.fleetCustomers);
    this.selectedFleetCustomer = undefined;
  }

  reset() {
  }

  confirm() {
    if (this.selectedFleetCustomer) {
      this.close.emit({isFleetCustomerId: this.isFleetCustomerId, value: this.selectedFleetCustomer});
      this.modal.hide();
    }
  }

}
