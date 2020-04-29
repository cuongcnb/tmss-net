import { Component, ViewChild } from '@angular/core';
import { ProvincesService} from '../../../api/master-data/provinces.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import {ProvincesModel} from '../../../core/models/sales/provinces.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'provinces',
  templateUrl: './provinces.component.html',
  styleUrls: ['./provinces.component.scss']
})
export class ProvincesComponent {
  @ViewChild('provincesModal', {static: false}) provincesModal;

  provinces: Array<ProvincesModel>;
  fieldGrid;
  provinceParams;
  selectedProvince: ProvincesModel;

  constructor(
    private provincesService: ProvincesService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmService,
    private swalAlertService: ToastService,
  ) {
    this.fieldGrid = [
      {field: 'code'},
      {field: 'name'},
      {
        field: 'populationAmount',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'squareAmount',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Order',
        field: 'ordering',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'status',
        cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {
        headerName: 'Region',
        field: 'region',
      },
    ];
  }

  callbackGridProvinces(params) {
    this.loadingService.setDisplay(true);
    this.provincesService.getAllProvinces().subscribe(provinces => {
      this.provinces = provinces;
      params.api.setRowData(provinces);
      this.loadingService.setDisplay(false);
    });
    this.provinceParams = params;
  }

  refreshList() {
    this.callbackGridProvinces(this.provinceParams);
    this.selectedProvince = undefined;
  }

  getParamsProvince() {
    const selectedProvince = this.provinceParams.api.getSelectedRows();
    if (selectedProvince) {
      this.selectedProvince = selectedProvince[0];
    }
  }

  updateProvince() {
    if (this.selectedProvince) {
      this.provincesModal.open(this.selectedProvince);
    } else {
      this.swalAlertService.openWarningForceSelectData();
    }
  }

  deleteProvince() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.provincesService.deleteProvince(this.selectedProvince.id).subscribe(() => {
          this.refreshList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
