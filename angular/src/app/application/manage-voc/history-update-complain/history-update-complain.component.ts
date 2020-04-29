import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HistoryUpdateComplainModel } from '../../../core/models/manage-voc/history-update-complain.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'history-update-complain',
  templateUrl: './history-update-complain.component.html',
  styleUrls: ['./history-update-complain.component.scss'],
})
export class HistoryUpdateComplainComponent implements OnInit {

  form: FormGroup;
  fieldGrid;
  gridParams;
  selectedRowData: HistoryUpdateComplainModel;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {
        headerName: 'Thông tin người dùng', children: [
          {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'supplier'},
          {headerName: 'Người cập nhật', headerTooltip: 'Người cập nhật', field: 'updater'},
        ],
      },
      {
        headerName: 'Thông tin chung', children: [
          {headerName: 'Người liên hệ', headerTooltip: 'Người liên hệ', field: 'contacter'},
          {headerName: 'Khách hàng', headerTooltip: 'Khách hàng', field: 'customerName'},
          {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'customerPhone'},
          {headerName: 'Model', headerTooltip: 'Model', field: 'model'},
          {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'licensePlate'},
        ],
      },
      {
        headerName: 'Thông tin cập nhật', children: [
          {headerName: 'Ngày, giờ cập nhật', headerTooltip: 'Ngày, giờ cập nhật', field: 'datetimeUpdate'},
          {headerName: 'Thông tin thay đổi', headerTooltip: 'Thông tin thay đổi', field: 'infoModify'},
          {headerName: 'Giá trị cũ', headerTooltip: 'Giá trị cũ', field: 'oldValue'},
          {headerName: 'Giá trị cập nhật', headerTooltip: 'Giá trị cập nhật', field: 'updateValue'},
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
      staffs: [undefined],
      dateUpdate: [undefined],
      toDate: [undefined],
    });
  }
}
