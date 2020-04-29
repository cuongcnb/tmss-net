import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ContactCustomModel } from '../../../../core/models/fir/contact-custom.model';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'work-done',
  templateUrl: './work-done.component.html',
  styleUrls: ['./work-done.component.scss']
})
export class WorkDoneComponent implements OnInit, OnChanges {
  @Input() detailData;
  selectedData: ContactCustomModel;
  fieldGrid: Array<any>;
  data: Array<any>;
  params;
  gridParams;
  selectRowGrid;
  constructor() {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Loại hình sửa chữa ', headerTooltip: 'Loại hình sửa chữa ', field: 'loaiSC'},
      {headerName: 'Lệnh SC', headerTooltip: 'Lệnh SC', field: ' lenhSC'},
      {headerName: 'Cố vấn dịch vụ', headerTooltip: 'Cố vấn dịch vụ', field: ' covanDv'},
      {headerName: 'Nội dung công việc', headerTooltip: 'Nội dung công việc', field: ' ndCv'},
      {headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: ' thanhtienSC'},
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'thueSC'},
    ];
  }
  callbackGrid(params) {
    this.params = params ;
    params.api.setRowData([this.selectedData]);
  }
  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectRowGrid = selectedData[0];
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.detailData && this.detailData) {
      this.gridParams.api.setRowData(this.detailData);
    }
  }
}
