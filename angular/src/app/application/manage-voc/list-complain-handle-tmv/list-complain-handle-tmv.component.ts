import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListComplainHandleTmvModel } from '../../../core/models/manage-voc/list-complain-handle-tmv.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'list-complain-handle-tmv',
  templateUrl: './list-complain-handle-tmv.component.html',
  styleUrls: ['./list-complain-handle-tmv.component.scss'],
})
export class ListComplainHandleTmvComponent implements OnInit {

  form: FormGroup;
  fieldGrid;
  gridParams;
  selectedRowData: ListComplainHandleTmvModel;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {headerName: 'Ngày tiếp nhận', headerTooltip: 'Ngày tiếp nhận', field: 'dateReception'},
      {headerName: 'Ngày gửi TMV', headerTooltip: 'Ngày gửi TMV', field: 'dateSendTMV'},
      {headerName: 'Đại lý xử lý', headerTooltip: 'Đại lý xử lý', field: 'supplierReception'},
      {headerName: 'Người liên hện', headerTooltip: 'Người liên hện', field: 'contacter'},
      {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'contacterPhone'},
      {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'contacterAddress'},
      {headerName: 'Chủ xe', headerTooltip: 'Chủ xe', field: 'driversName'},
      {headerName: 'Loại xe', headerTooltip: 'Loại xe', field: 'carType'},
      {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'licensePlate'},
      {headerName: 'Số Vin', headerTooltip: 'Số Vin', field: 'vin'},
    ];
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowData = selectedData[0];
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dateReception: [undefined],
      toDate: [undefined],
      contacter: [undefined],
      licensePlate: [undefined],
    });
  }
}
