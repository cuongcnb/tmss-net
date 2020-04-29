import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../shared/loading/loading.service';
import { FleetCustomerService} from '../../../api/fleet-sale/fleet-customer.service';
import { ToastService } from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fleet-customer',
  templateUrl: './fleet-customer.component.html',
  styleUrls: ['./fleet-customer.component.scss']
})
export class FleetCustomerComponent implements OnInit {
  @ViewChild('modifyFleetCustomer', { static: false }) modifyFleetCustomer;
  fieldGridFleetCustomer;
  fleetCustomerParams;
  selectedFleetCustomer;
  fleetCustomers;

  constructor(
    private toastService: ToastService,
    private loadingService: LoadingService,
    private fleetCustomerService: FleetCustomerService
  ) {
    this.fieldGridFleetCustomer = [
      { field: 'code', width: 80, resizable: true },
      { field: 'name', width: 100, resizable: true },
      { field: 'address', width: 150, resizable: true },
      { field: 'phone', width: 100, resizable: true },
      { field: 'fax', width: 100, resizable: true },
      { field: 'email', width: 150, resizable: true },
      { field: 'contactPerson', width: 100, resizable: true },
      { headerName: 'Contact Address', field: 'contactPersonAddress', width: 150, resizable: true },
      { headerName: 'Contact Phone', field: 'contactPersonPhone', width: 150, resizable: true },
    ];
  }

  ngOnInit() {
  }

  callbackGridFleetCustomer(params) {
    this.loadingService.setDisplay(true);
    this.fleetCustomerService.getAllFleetCustomer().subscribe(fleetCustomers => {
      this.fleetCustomers = fleetCustomers;
      params.api.setRowData(this.fleetCustomers);
      const allColumnIds = [];
      params.columnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));
      params.columnApi.autoSizeColumns(allColumnIds);
      this.loadingService.setDisplay(false);
    });
    this.fleetCustomerParams = params;
  }

  getParamsFleetCustomer() {
    const selectedFleetCustomer = this.fleetCustomerParams.api.getSelectedRows();
    if (selectedFleetCustomer) {
      this.selectedFleetCustomer = selectedFleetCustomer[0];
    }
  }

  refreshFleetCustomer() {
    this.callbackGridFleetCustomer(this.fleetCustomerParams);
    this.selectedFleetCustomer = undefined;
  }

  updateFleetCustomer() {
    !this.selectedFleetCustomer
      ? this.toastService.openWarningForceSelectData()
      : this.modifyFleetCustomer.open(this.selectedFleetCustomer);
  }
}
