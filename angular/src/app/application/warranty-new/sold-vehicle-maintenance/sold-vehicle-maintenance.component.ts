import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {AgSelectRendererComponent} from '../../../shared/ag-select-renderer/ag-select-renderer.component';
import {AgDatepickerRendererComponent} from '../../../shared/ag-datepicker-renderer/ag-datepicker-renderer.component';
import * as moment from 'moment';
import {SoldVehicleMaintenanceApi} from '../../../api/warranty/sold-vehicle-maintenance.api';

@Component({
  selector: 'sold-vehicle-maintenance',
  templateUrl: './sold-vehicle-maintenance.component.html',
  styleUrls: ['./sold-vehicle-maintenance.component.scss']
})
export class SoldVehicleMaintenanceComponent implements OnInit {

  @ViewChild('updateModal', {static: false}) updateModal;
  form;
  params;
  selectedData;
  data;
  gridField;
  rowClassRules;
  currencyList;
  paginationParams;
  paginationTotalsData: number;
  frameworkComponents;

  constructor(
    private swalAlertService: ToastService,
    private gridTableService: GridTableService,
    private confirmService: ConfirmService,
    private loadingService: LoadingService,
    private soldVehicleMaintenanceApi: SoldVehicleMaintenanceApi
  ) {
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent,
      agDatepickerRendererComponent: AgDatepickerRendererComponent
    };
    this.gridField = [
      {
        headerName: 'Số VIN',
        headerTooltip: 'Số VIN',
        field: 'vinno',
        cellClass: ['cell-border', 'p-0'],
        width: 150,
        resizable: true,
        pinned: true
      },
      {
        headerName: 'Dòng xe',
        headerTooltip: 'Dòng xe',
        field: 'model',
        cellClass: ['cell-border', 'p-0'],
        width: 150,
        resizable: true,
        pinned: true
      },
      {
        headerName: 'SFX',
        headerTooltip: 'SFX',
        field: 'sfx',
        cellClass: ['cell-border', 'p-0'],
        width: 50,
        resizable: true,
        pinned: true
      },
      {
        headerName: 'Màu',
        headerTooltip: 'Màu',
        field: 'color',
        width: 50,
        resizable: true,
        pinned: true
      },
      {
        headerName: 'VHE',
        headerTooltip: 'VHE',
        children: [
          {
            headerName: 'Engine',
            field: 'engineNo',
            resizable: true,
            pinned: true,
            width: 100
          },
          {
            headerName: 'Name Code',
            field: 'nameCode',
            resizable: true,
            pinned: true,
            width: 70
          },
          {
            headerName: 'Ngày hết hạn',
            field: 'lineOffDate',
            resizable: true,
            pinned: true,
            width: 70
          },
        ],
      },
      {
        headerName: 'Dealer Code',
        headerTooltip: 'Dealer Code',
        field: 'abbreviation',
        resizable: true,
        pinned: true
      },
      {
        headerName: 'OrderNo',
        headerTooltip: 'Order No',
        field: 'orderNo',
        resizable: true,
        pinned: true
      },
      {
        headerName: 'Ngày bán',
        headerTooltip: 'Sale Date',
        field: 'saleDate',
        resizable: true,
        pinned: true
      },
    ];
  }
  ngOnInit() {
  }

  callbackGrid(params) {
    params.api.setRowData([]);
    this.params = params;
    this.callApi();
  }

  callApi() {
    // this.soldVehicleMaintenanceApi.getExchangeRate().subscribe(val => {
    //   this.data = val;
    //   this.params.api.setRowData(this.data);
    // });
  }

  getParams() {
    this.selectedData = this.params.api.getSelectedRows()[0];
  }

  update() {
    if (this.selectedData) {
      this.updateModal.open(this.selectedData);
    }
  }

  delete() {
    this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn').subscribe(res => {
      this.loadingService.setDisplay(true);
      // this.exchangeRateApi.removeExchange(this.selectedData.id).subscribe(() => {
      //   this.params.api.updateRowData({remove: [this.selectedData]});
      //   this.refreshData();
      //   this.loadingService.setDisplay(false);
      //   this.swalAlertService.openSuccessToast();
      // });
    });
  }

  refreshData() {
    this.selectedData = undefined;
    this.callbackGrid(this.params);
  }

  changePaginationParams(paginationParams) {
    if (!this.data) {
      return;
    }
    this.paginationParams = paginationParams;
  }

}
