import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { KaizenApiModel } from '../../../core/models/kaizen-api/kaizen-api.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'update-kaizen-service-data',
  templateUrl: './update-kaizen-service-data.component.html',
  styleUrls: ['./update-kaizen-service-data.component.scss']
})
export class UpdateKaizenServiceDataComponent implements OnInit {
  form: FormGroup;
  gridParams;
  fieldGrid;
  selectedRowGrid: KaizenApiModel;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'THÔNG TIN CHUNG', children: [
          {headerName: 'Số lệnh sửa chữa', headerTooltip: 'Số lệnh sửa chữa', field: 'numberRepair', minWidth: 110},
          {headerName: 'Ngày quyết toán', headerTooltip: 'Ngày quyết toán', field: 'settlementDate', minWidth: 110},
          {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'licensePlates', minWidth: 110},
          {headerName: 'Cố vấn dịch vụ', headerTooltip: 'Cố vấn dịch vụ', field: 'isCVDV', minWidth: 110},
          {headerName: 'Loại SC', headerTooltip: 'Loại SC', field: 'typeRepair', minWidth: 110},
        ]},
      {headerName: 'THÔNG TIN HẸN', children: [
          {headerName: 'Thời điểm hẹn', headerTooltip: 'Thời điểm hẹn', field: 'appointmentTime', minWidth: 110},
          {headerName: 'Nội dung hẹn', headerTooltip: 'Nội dung hẹn', field: 'appointmentContent', minWidth: 110},
          {headerName: 'Xác nhận hẹn', headerTooltip: 'Xác nhận hẹn', field: 'appointmentConfirm', minWidth: 110},
        ]},
      {headerName: 'THỜI GIAN', children: [
          {headerName: 'Đồng', children: [
              {headerName: 'Thời điểm bắt đầu', headerTooltip: 'Thời điểm bắt đầu', field: 'startTime1', minWidth: 110},
              {headerName: 'Thời điểm kết thúc', headerTooltip: 'Thời điểm kết thúc', field: 'overTime1', minWidth: 110},
            ]},
          {headerName: 'Nền', children: [
              {headerName: 'Thời điểm bắt đầu', headerTooltip: 'Thời điểm bắt đầu', field: 'startTime2', minWidth: 110},
              {headerName: 'Thời điểm kết thúc', headerTooltip: 'Thời điểm kết thúc', field: 'overTime2', minWidth: 110},
            ]},
          {headerName: 'Sơn', children: [
              {headerName: 'Thời điểm bắt đầu', headerTooltip: 'Thời điểm bắt đầu', field: 'startTime3', minWidth: 110},
              {headerName: 'Thời điểm kết thúc', headerTooltip: 'Thời điểm kết thúc', field: 'overTime3', minWidth: 110},
            ]},
          {headerName: 'Đánh bóng', children: [
              {headerName: 'Thời điểm bắt đầu', headerTooltip: 'Thời điểm bắt đầu', field: 'startTime4', minWidth: 110},
              {headerName: 'Thời điểm kết thúc', headerTooltip: 'Thời điểm kết thúc', field: 'overTime4', minWidth: 110},
            ]},
          {headerName: 'Lắp ráp', children: [
              {headerName: 'Thời điểm bắt đầu', headerTooltip: 'Thời điểm bắt đầu', field: 'startTime5', minWidth: 110},
              {headerName: 'Thời điểm kết thúc', headerTooltip: 'Thời điểm kết thúc', field: 'overTime5', minWidth: 110},
            ]},
          {headerName: 'Ngày giờ bắt đầu sửa xe', headerTooltip: 'Ngày giờ bắt đầu sửa xe', field: 'startDate', minWidth: 110},
          {headerName: 'Ngày giờ kết thức sửa xe', headerTooltip: 'Ngày giờ kết thức sửa xe', field: 'overDate', minWidth: 110},
          {headerName: 'Ngày giờ xe rời đại lý', headerTooltip: 'Ngày giờ xe rời đại lý', field: 'leaveDate', minWidth: 110},
        ]},
      {headerName: 'Phân cấp bảo dưỡng', headerTooltip: 'Phân cấp bảo dưỡng', field: 'leverMaintenance', minWidth: 110},
      {headerName: 'Bảo dưỡng ++', headerTooltip: 'Bảo dưỡng ++', field: 'isMaintenance', minWidth: 110},
      {headerName: 'Loại hình sửa chữa ĐS', headerTooltip: 'Loại hình sửa chữa ĐS', field: 'speciesRepair', minWidth: 110},
      {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'isStatus', minWidth: 110},
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
      settlementDate: [undefined],
      settlementDateTo: [undefined],
    });
  }
}
