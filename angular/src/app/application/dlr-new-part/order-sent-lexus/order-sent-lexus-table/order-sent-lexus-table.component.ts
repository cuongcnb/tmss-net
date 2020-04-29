import { Component, OnInit } from '@angular/core';
import { OrderSentLexusModel } from '../../../../core/models/dlr-new-part/order-sent-lexus.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'order-sent-lexus-table',
  templateUrl: './order-sent-lexus-table.component.html',
  styleUrls: ['./order-sent-lexus-table.component.scss']
})
export class OrderSentLexusTableComponent implements OnInit {
  gridParams;
  fieldGrid;
  selectedRowGrid: OrderSentLexusModel;

  constructor(
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'STT', headerTooltip: 'Số thứ tự', field: 'isStt'},
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'codePT'},
      {headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', field: 'ptName'},
      {headerName: 'ĐVT', headerTooltip: 'Đơn vị tính', field: 'isDVT'},
      {headerName: 'SL', headerTooltip: 'Số lượng', field: 'isAmount'},
      {headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'isPrice'},
      {headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'isMoney'},
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'isTax'},
      {headerName: 'Tên xe', headerTooltip: 'Tên xe', field: 'carName'},
      {headerName: 'Model code', headerTooltip: 'Model code', field: 'codeMD'},
      {headerName: 'Số Vin', headerTooltip: 'Số Vin', field: 'isVin'},
      {headerName: 'Mã CK', headerTooltip: 'Mã CK', field: 'codeCK'},
      {headerName: 'Số ghế', headerTooltip: 'Số ghế', field: 'isSeat'},
    ];
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowGrid = selectedData[0];
    }
  }
}
