import { Component, OnInit } from '@angular/core';
import { SearchExtractDataModel } from '../../../../core/models/search-extract-data/search-extract-data.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'info-history-datatable',
  templateUrl: './info-history-datatable.component.html',
  styleUrls: ['./info-history-datatable.component.scss']
})
export class InfoHistoryDatatableComponent implements OnInit {
  fieldGrid;
  gridParams;
  selectedRowGrid: SearchExtractDataModel;
  constructor() {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'sortAgency'},
      {headerName: 'Số lệnh sửa chữa', headerTooltip: 'Số lệnh sửa chữa', field: 'numberSC'},
      {headerName: 'Ngày xe đến', headerTooltip: 'Ngày xe đến', field: 'arrivalDate'},
      {headerName: 'Ngày xe ra', headerTooltip: 'Ngày xe ra', field: 'arrivalDateTo'},
      {headerName: 'Số Km vào', headerTooltip: 'Số Km vào', field: 'errorKm'},
      {headerName: 'Nội dung SC', headerTooltip: 'Nội dung SC', field: 'contentSC'},
      {headerName: 'LHSC', headerTooltip: 'LHSC', field: 'LHSC'},
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'CVDV'},
      {headerName: 'Kỹ thuật viên', headerTooltip: 'Kỹ thuật viên', field: 'isTechnicians'},
      {headerName: 'Số Vin', headerTooltip: 'Số Vin', field: 'errorVin'},
      {headerName: 'BKS', headerTooltip: 'BKS', field: 'licensePlates'},
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
