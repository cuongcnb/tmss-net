import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchExtractDataModel } from '../../../core/models/search-extract-data/search-extract-data.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'call-search',
  templateUrl: './call-search.component.html',
  styleUrls: ['./call-search.component.scss']
})
export class CallSearchComponent implements OnInit {
  fieldGrid;
  form: FormGroup;
  gridParams;
  selectedRowGrid: SearchExtractDataModel;
  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Thông tin xe', headerTooltip: 'Thông tin xe',
        children: [
          {headerName: 'Tư vấn bán hàng', headerTooltip: 'Tư vấn bán hàng', field: 'saleConsultant'},
          {headerName: 'Ngày giao xe', headerTooltip: 'Ngày giao xe', field: 'dealDate'},
          {headerName: 'Model', headerTooltip: 'Model', field: 'errorModel'},
          {headerName: 'Vin', headerTooltip: 'Vin', field: 'errorVin'},
          {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'licensePlates'},
        ]},
      {headerName: 'Thông tin khách hàng', headerTooltip: 'Thông tin khách hàng',
        children: [
          {headerName: 'Thông tin chủ xe', headerTooltip: 'Thông tin chủ xe',
            children: [
              {headerName: 'Tên chủ xe', headerTooltip: 'Tên chủ xe', field: 'isName'},
              {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'isAddress'},
              {headerName: 'Điện thoại', headerTooltip: 'Điện thoại', field: 'isPhone'},
              {headerName: 'Email chủ xe', headerTooltip: 'Email chủ xe', field: 'isEmail'},
              {headerName: 'Quận/ huyện', headerTooltip: 'Quận/ huyện', field: 'isDistrict'},
              {headerName: 'Tỉnh/ TP', headerTooltip: 'Tỉnh/ TP', field: 'isCity'},
            ]},
          {headerName: 'Thông tin công ty', headerTooltip: 'Thông tin công ty',
            children: [
              {headerName: 'Tên công ty', headerTooltip: 'Tên công ty', field: 'companyName'},
              {headerName: 'Địa chỉ công ty', headerTooltip: 'Địa chỉ công ty', field: 'companyAddress'},
              {headerName: 'Điện thoại công ty', headerTooltip: 'Điện thoại công ty', field: 'companyPhone'},
              {headerName: 'Email công ty', headerTooltip: 'Email công ty', field: 'companyEmail'},
            ]},
          {headerName: 'Thông tin người lái xe', headerTooltip: 'Thông tin người lái xe',
            children: [
              {headerName: 'Người mang xe', headerTooltip: 'Người mang xe', field: 'isDriver'},
              {headerName: 'Địa chỉ lái xe', headerTooltip: 'Địa chỉ lái xe', field: 'driverAddress'},
              {headerName: 'Điện thoại lái xe', headerTooltip: 'Điện thoại lái xe', field: 'driverPhone'},
              {headerName: 'Email lái xe', headerTooltip: 'Email lái xe', field: 'driverEmail'},
            ]},
        ]},
      {headerName: 'Nội dung liên lạc', headerTooltip: 'Nội dung liên lạc',
        children: [
          {headerName: 'Ngày hẹn', headerTooltip: 'Ngày hẹn', field: 'dateAppointment'},
          {headerName: 'Ngày liên hệ dự kiến', headerTooltip: 'Ngày liên hệ dự kiến', field: 'expectedDate'},
          {headerName: 'Ngày liên hệ thực tế', headerTooltip: 'Ngày liên hệ thực tế', field: 'dayReality'},
          {headerName: 'Giờ liên hệ', headerTooltip: 'Giờ liên hệ', field: 'contactHour'},
          {headerName: 'Người gọi', headerTooltip: 'Người gọi', field: 'callPeople'},
          {headerName: 'ND cuộc gọi', headerTooltip: 'ND cuộc gọi', field: 'contentCall'},
          {headerName: 'Loại hình liên lạc', headerTooltip: 'Loại hình liên lạc', field: 'contactType'},
          {headerName: 'Trạng thái liên hệ', headerTooltip: 'Trạng thái liên hệ', field: 'contactStatus'},
          {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'errorReason'},
          {headerName: 'Lý do không quay lại', headerTooltip: 'Lý do không quay lại', field: 'reasonKH'},
          {headerName: 'Ghi chú không quay lại', headerTooltip: 'Ghi chú không quay lại', field: 'noteReason'},
          {headerName: 'Số Km cập nhật', headerTooltip: 'Số Km cập nhật', field: 'updateKm'},
          {headerName: 'Mốc BD tiếp theo', headerTooltip: 'Mốc BD tiếp theo', field: 'nextBDto'},
          {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'isNote'},
          {headerName: 'Chú thích', headerTooltip: 'Chú thích', field: 'isAnnotate'},
        ]},
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
      contactType: [undefined],
      fromDate: [undefined],
      fromDateTo: [undefined],
      errorStatus: [undefined],
      callResult: [undefined],
      callPeople: [undefined],
    });
  }
}
