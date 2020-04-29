import {Component, OnInit, ViewChild} from '@angular/core';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {AgSelectRendererComponent} from '../../../shared/ag-select-renderer/ag-select-renderer.component';
import {AgDatepickerRendererComponent} from '../../../shared/ag-datepicker-renderer/ag-datepicker-renderer.component';
import * as moment from 'moment';
import {ExchangeRateMaintenanceApi} from '../../../api/warranty/exchange-rate-maintenance.api';
import {CurrencyApi} from '../../../api/common-api/currency.api';
import {LoadingService} from '../../../shared/loading/loading.service';

@Component({
  selector: 'exchange-rate-maintenance',
  templateUrl: './exchange-rate-maintenance.component.html',
  styleUrls: ['./exchange-rate-maintenance.component.scss']
})
export class ExchangeRateMaintenanceComponent implements OnInit {
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
    private exchangeRateApi: ExchangeRateMaintenanceApi,
    private loadingService: LoadingService,
    private currencyApi: CurrencyApi,
  ) {
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent,
      agDatepickerRendererComponent: AgDatepickerRendererComponent
    };
    this.gridField = [
      {
        headerName: 'Đơn vị tiền tệ',
        headerTooltip: 'Đơn vị tiền tệ',
        children: [
          {
            headerName: 'Mã',
            field: 'currencycode',
            resizable: true,
            pinned: true
          },
          {
            headerName: 'Tên',
            field: 'currencyName',
            resizable: true,
            pinned: true
          },
        ],
      },
      {
        headerName: 'Ngày bắt đầu',
        headerTooltip: 'Ngày bắt đầu',
        field: 'startdate',
        cellClass: ['cell-border', 'p-0'],
        cellRenderer: params => params ? moment(params.data.inDate).format('DD/MM/YYYY') : '',
        resizable: true,
        pinned: true
      },
      {
        headerName: 'Ngày kết thúc',
        headerTooltip: 'Ngày kết thúc',
        field: 'enddate',
        cellClass: ['cell-border', 'p-0'],
        cellRenderer: params => params ? moment(params.data.inDate).format('DD/MM/YYYY') : '',
        resizable: true,
        pinned: true
      },
      {
        headerName: 'Tỷ giá',
        headerTooltip: 'Tỷ giá',
        field: 'exchangerate',
        resizable: true,
        pinned: true
      }
    ];
  }
  ngOnInit() {
    this.currencyApi.getAll().subscribe(val => this.currencyList = val);
  }

  callbackGrid(params) {
    params.api.setRowData([]);
    this.params = params;
    this.callApi();
  }

  callApi() {
    this.exchangeRateApi.getExchangeRate().subscribe(val => {
      this.data = val;
      this.params.api.setRowData(this.data);
    });
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
      this.exchangeRateApi.removeExchange(this.selectedData.id).subscribe(() => {
        this.params.api.updateRowData({remove: [this.selectedData]});
        this.refreshData();
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessToast();
      });
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
