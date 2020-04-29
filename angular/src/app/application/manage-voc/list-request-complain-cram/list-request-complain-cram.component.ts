import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListRequestComplainCramModel } from '../../../core/models/manage-voc/list-request-complain-cram.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'list-request-complain-cram',
  templateUrl: './list-request-complain-cram.component.html',
  styleUrls: ['./list-request-complain-cram.component.scss'],
})
export class ListRequestComplainCramComponent implements OnInit {

  form: FormGroup;
  fieldGrid;
  gridParams;
  selectedRowData: ListRequestComplainCramModel;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {
        headerName: 'Thông tin chung', children: [
          {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'supplier'},
          {headerName: 'Nội dung khiếu nại', headerTooltip: 'Nội dung khiếu nại', field: 'complainContent'},
          {headerName: 'Ngày tiếp nhận', headerTooltip: 'Ngày tiếp nhận', field: 'dateReception'},
          {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
        ],
      },
      {
        headerName: 'Thông tin khách hàng', children: [
          {headerName: 'Người liên hệ', headerTooltip: 'Người liên hệ', field: 'contacter'},
          {headerName: 'Tên chử xe', headerTooltip: 'Tên chử xe', field: 'driversName'},
          {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'driversPhone'},
          {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'driversAddress'},
        ],
      },
      {
        headerName: 'Thông tin xe', children: [
          {headerName: 'Loại xe', headerTooltip: 'Loại xe', field: 'carType'},
          {headerName: 'Số km', headerTooltip: 'Số km', field: 'km'},
          {headerName: 'VIN', headerTooltip: 'VIN', field: 'vin'},
          {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'licensePlate'},
        ],
      },
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
      supplier: [undefined],
      fromDate: [undefined],
      toDate: [undefined],
      status: [undefined],
    });
  }
}
