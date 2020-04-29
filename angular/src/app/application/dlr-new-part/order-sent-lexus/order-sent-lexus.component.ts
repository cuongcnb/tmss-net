import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderSentLexusModel } from '../../../core/models/dlr-new-part/order-sent-lexus.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'order-sent-lexus',
  templateUrl: './order-sent-lexus.component.html',
  styleUrls: ['./order-sent-lexus.component.scss']
})
export class OrderSentLexusComponent implements OnInit {
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
      {headerName: 'Mã ĐH', headerTooltip: 'Mã ĐH', field: 'codeDH'},
      {headerName: 'Số ĐH', headerTooltip: 'Số ĐH', field: 'numberDH'},
      {headerName: 'Số ĐH gửi TMV', headerTooltip: 'Số ĐH gửi TMV', field: 'sentTMV'},
      {headerName: 'ĐL nhận', headerTooltip: 'ĐL nhận', field: 'sortAgency'},
      {headerName: 'Đại lý ghi chú', headerTooltip: 'Đại lý ghi chú', field: 'sortAgencyNote'},
      {headerName: 'Lexus ghi chú', headerTooltip: 'Lexus ghi chú', field: 'lexusNote'},
      {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'isStatus'},
      {headerName: 'PTVC', headerTooltip: 'PTVC', field: 'isPTVC'},
      {headerName: 'Ngày tạo', headerTooltip: 'Ngày tạo', field: 'isDate'},
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
      sortAgency: [undefined],
      isStatus: [undefined],
      codeDH: [undefined],
      codePT: [undefined],
      dateTime: [undefined],
      dateTimeTo: [undefined],
      sentTMV: [undefined],
    });
  }
}
