import { Component, OnInit, ViewChild } from '@angular/core';
import { LogisticsCompanyService} from '../../../api/master-data/logistics-company.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { TruckService} from '../../../api/master-data/truck.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'logistics-company',
  templateUrl: './logistics-company.component.html',
  styleUrls: ['./logistics-company.component.scss']
})
export class LogisticsCompanyComponent implements OnInit {
  @ViewChild('logisticModal', {static: false}) logisticModal;
  @ViewChild('truckModal', {static: false}) truckModal;

  logisticGridField;
  truckGridField;
  logisticCompanies;
  trucks;
  selectedCompany;
  selectedTruck;
  logisticCompanyParams;
  truckParams;

  constructor(private logisticsCompanyService: LogisticsCompanyService,
              private truckService: TruckService,
              private loadingService: LoadingService,
              private confirmationService: ConfirmService,
              private swalAlertService: ToastService,
  ) {
    this.logisticGridField = [
      {field: 'code'},
      {headerName: 'Vietnamese Name', field: 'vnName', minWidth: 240},
      {headerName: 'English Name', field: 'enName', minWidth: 240},
      {
        headerName: 'Order',
        field: 'ordering',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {field: 'contactPerson'},
      {
        field: 'status',
        valueFormatter: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {
        field: 'taxCode',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'bankNo',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
        minWidth: 140
      },
      {
        headerName: 'Telephone',
        field: 'tel',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
        minWidth: 100
      },
      {
        field: 'fax',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
        minWidth: 100
      },
      {
        field: 'address',
        cellClass: ['cell-border', 'cell-wrap-text'],
        autoHeight: true,
        minWidth: 200
      },
    ];
    this.truckGridField = [
      {field: 'registerNo'},
      {
        headerName: 'Means Of Transportation',
        field: 'transportationType'
      },
      {
        headerName: 'Pro Year',
        field: 'productionYear',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'ownerType',
        valueFormatter: params => {
          return `${params.value === 'O' ? 'Owner' : 'Rental'}`;
        }
      },
      {field: 'driverName'},
      {field: 'driverPhone'},
      {
        field: 'ordering',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'status', valueFormatter: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {
        field: 'description',
        cellClass: ['cell-border', 'cell-wrap-text'],
        autoHeight: true
      },
    ];
  }

  ngOnInit() {
  }

  callbackGridLogistic(params) {
    this.loadingService.setDisplay(true);
    this.logisticsCompanyService.getLogisticCompany().subscribe(logisticCompanies => {
      this.logisticCompanies = logisticCompanies;
      params.api.setRowData(this.logisticCompanies);
      this.loadingService.setDisplay(false);
    });
    this.logisticCompanyParams = params;
  }

  getParamsLogistic() {
    const selectedCompany = this.logisticCompanyParams.api.getSelectedRows();
    this.selectedTruck = undefined;
    this.loadingService.setDisplay(true);
    if (selectedCompany) {
      this.selectedCompany = selectedCompany[0];
      this.refreshTruckList();
      this.loadingService.setDisplay(false);
    }
  }

  refreshCompanyList() {
    this.selectedCompany = undefined;
    this.selectedTruck = undefined;
    this.logisticsCompanyService.getLogisticCompany().subscribe(logisticCompanies => {
      this.logisticCompanies = logisticCompanies;
      this.logisticCompanyParams.api.setRowData(this.logisticCompanies);
      this.loadingService.setDisplay(false);
    });
  }

  callbackGridTruck(params) {
    this.truckParams = params;
  }

  getParamsTruck() {
    const selectedTruck = this.truckParams.api.getSelectedRows();
    if (selectedTruck) {
      this.selectedTruck = selectedTruck[0];
    }
  }

  refreshTruckList() {
    this.truckService.getTrucks(this.selectedCompany.id).subscribe(trucks => {
      this.trucks = trucks;
      this.truckParams.api.setRowData(this.trucks);
    });
    this.selectedTruck = undefined;
  }

  updateLogistic() {
    if (this.selectedCompany) {
      this.logisticModal.open(this.selectedCompany);
    } else {
      this.swalAlertService.openWarningForceSelectData('You haven\'t selected any Logistic, please select one to do', 'Select a Logistic');
    }
  }

  deleteLogistic() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.logisticsCompanyService.deleteLogistic(this.selectedCompany.id).subscribe(() => {
          this.refreshCompanyList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }

  addTruck() {
    this.selectedCompany
      ? this.truckModal.open(this.selectedCompany.id)
      : this.swalAlertService.openWarningForceSelectData('You haven\'t selected any Logistic, please select one to do', 'Select a Logistic');

  }

  updateTruck() {
    if (this.selectedTruck) {
      this.truckModal.open(this.selectedCompany.id, this.selectedTruck);
    } else {
      this.swalAlertService.openWarningForceSelectData('You haven\'t selected any Truck, please select one to update', 'Select a Truck to update');

    }
  }

  deleteTruck() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.truckService.deleteTruct(this.selectedTruck.id).subscribe(() => {
          this.refreshTruckList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}

