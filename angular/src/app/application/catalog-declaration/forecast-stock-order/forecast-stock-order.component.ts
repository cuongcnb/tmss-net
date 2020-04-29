import { Component, ViewChild } from '@angular/core';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ForecastOrderModel } from '../../../core/models/catalog-declaration/forecast-order.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'forecast-stock-order',
  templateUrl: './forecast-stock-order.component.html',
  styleUrls: ['./forecast-stock-order.component.scss'],
})
export class ForecastStockOrderComponent {
  @ViewChild('forecastModal', {static: false}) forecastModal;
  @ViewChild('bookOrder', {static: false}) bookOrder;

  gridField;
  gridParams;
  selectedData: ForecastOrderModel;

  data = [
    {
      numberOrder: '1',
      accessaryId: 'A1',
      accessaryName: 'Bánh xe',
      dvt: '',
      dad: '',
      sellAmount: '12',
      inventoryAmount: '123',
      ddAmount: '42',
      mip: '',
      dkAmount: '5543',
      soq: '',
      realAmount: '2345',
      unitPrice: '60.000.000',
      money: '150.000.000',
      tax: '10%',
    },
  ];

  constructor(
    private swalAlertService: ToastService,
  ) {
    this.gridField = [
      {headerName: 'STT', headerTooltip: 'Số thứ tự', field: 'numberOrder'},
      {headerName: 'Mã phụ tùng', headerTooltip: 'Mã phụ tùng', field: 'accessaryId'},
      {headerName: 'Tên phụ tùng', headerTooltip: 'Tên phụ tùng', field: 'accessaryName'},
      {headerName: 'ĐVT', headerTooltip: 'Đơn vị tính', field: 'dvt'},
      {headerName: 'DAD', headerTooltip: 'DAD', field: 'dad'},
      {headerName: 'SL bán hàng', headerTooltip: 'Số lượng bán hàng', field: 'sellAmount', cellClass: ['cell-readonly', 'cell-border', 'text-right']},
      {headerName: 'SL tồn kho', headerTooltip: 'Số lượng tồn kho', field: 'inventoryAmount', cellClass: ['cell-readonly', 'cell-border', 'text-right']},
      {headerName: 'SL ĐĐ', headerTooltip: 'Số lượng ĐĐ', field: 'ddAmount', cellClass: ['cell-readonly', 'cell-border', 'text-right']},
      {headerName: 'MIP', headerTooltip: 'MIP', field: 'mip', cellClass: ['cell-readonly', 'cell-border', 'text-right']},
      {headerName: 'SL đặt DK', headerTooltip: 'Số lượng đặt DK', field: 'dkAmount', cellClass: ['cell-readonly', 'cell-border', 'text-right']},
      {headerName: 'SOQ', headerTooltip: 'SOQ', field: 'soq', cellClass: ['cell-readonly', 'cell-border', 'text-right']},
      {headerName: 'SL Đặt thực tế', headerTooltip: 'Số lượng Đặt thực tế', field: 'realAmount', cellClass: ['cell-readonly', 'cell-border', 'text-right']},
      {headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'unitPrice', cellClass: ['cell-readonly', 'cell-border', 'text-right']},
      {headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'money', cellClass: ['cell-readonly', 'cell-border', 'text-right']},
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'tax', cellClass: ['cell-readonly', 'cell-border', 'text-right']},
    ];
  }

  refreshForecast() {
    this.callbackForecast(this.gridParams);
  }

  callbackForecast(params) {
    params.api.setRowData(this.data);
    this.gridParams = params;
  }

  getParamsForecast() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
    }
  }

  bookStockOrder() {
    this.data
      ? this.bookOrder.open(this.data)
      : this.swalAlertService.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
  }

  updateForecast() {
    this.selectedData
      ? this.forecastModal.open(this.selectedData)
      : this.swalAlertService.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
  }
}
