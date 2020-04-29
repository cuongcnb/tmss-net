import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderSentLexusModel } from '../../../core/models/dlr-new-part/order-sent-lexus.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'order-specialized-parts-laxus',
  templateUrl: './order-specialized-parts-laxus.component.html',
  styleUrls: ['./order-specialized-parts-laxus.component.scss']
})
export class OrderSpecializedPartsLaxusComponent implements OnInit {
  form: FormGroup;
  gridParams;
  fieldGrid;
  selectedRowGrid: OrderSentLexusModel;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'STT', headerTooltip: 'Số thứ tự', field: 'isStt'},
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'codePT'},
      {headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', field: 'ptName'},
      {headerName: 'ĐVT', headerTooltip: 'Đơn vị tính', field: 'isDVT'},
      {headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'isPrice'},
      {headerName: 'SL cần đặt', headerTooltip: 'Số lượng cần đặt', field: 'isAmount'},
      {headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'isMoney'},
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'isTax'},
    ];
    this.buildForm();
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

  private buildForm() {
    this.form = this.formBuilder.group({
      isType: [undefined],
      agencyNote: [undefined],
      sortAgency: [undefined],
      isPerson: [undefined],
      dateTime: [undefined],
      numberDH: [undefined],
    });
  }
}
