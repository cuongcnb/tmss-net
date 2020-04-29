import { Component, OnInit } from '@angular/core';
import { SearchExtractDataModel } from '../../../../core/models/search-extract-data/search-extract-data.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contac-history-datatable',
  templateUrl: './contac-history-datatable.component.html',
  styleUrls: ['./contac-history-datatable.component.scss']
})
export class ContacHistoryDatatableComponent implements OnInit {
  fieldGrid;
  gridParams;
  selectedRowGrid: SearchExtractDataModel;
  constructor() {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Loại liên lạc', headerTooltip: 'Loại liên lạc', field: 'contactType'},
      {headerName: 'Ngày hẹn', headerTooltip: 'Ngày hẹn', field: 'dateAppointment'},
      {headerName: 'Giờ hẹn', headerTooltip: 'Giờ hẹn', field: 'hourAppointment'},
      {headerName: 'TT liên hệ', headerTooltip: 'TT liên hệ', field: 'infoContact'},
      {headerName: 'Kết quả liên hệ', headerTooltip: 'Kết quả liên hệ', field: 'resultContact'},
      {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'licensePlates'},
      {headerName: 'Số km', headerTooltip: 'Số km', field: 'Km'},
      {headerName: 'Ngày dự kiến', headerTooltip: 'Ngày dự kiến', field: 'expectedDate'},
      {headerName: 'TT đặt hẹn', headerTooltip: 'TT đặt hẹn', field: 'infoAppointment'},
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'CVDV'},
      {headerName: 'Phàn nàn', headerTooltip: 'Phàn nàn', field: 'isComplain'},
      {headerName: 'ND gọi', headerTooltip: 'ND gọi', field: 'contentCall'},
      {headerName: 'Lý do liên hệ không thành công', headerTooltip: 'Lý do liên hệ không thành công', field: 'contactFail'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'isNote'},
      {headerName: 'Người lên hệ', headerTooltip: 'Người lên hệ', field: 'errorContact'},
      {headerName: 'Ngày liên hệ', headerTooltip: 'Ngày liên hệ', field: 'contactData'},
      {headerName: 'Giờ liên hệ', headerTooltip: 'Giờ liên hệ', field: 'contactHour'},
      {headerName: 'Lý do KH không quay lại', headerTooltip: 'Lý do KH không quay lại', field: 'reasonKH'},
      {headerName: 'Ghi chú KH không quay lại', headerTooltip: 'Ghi chú KH không quay lại', field: 'noteReason'},
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
