import { Component, Input, OnInit, SimpleChanges , OnChanges } from '@angular/core';
import { ContactCustomModel } from '../../../../core/models/fir/contact-custom.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'accessary',
  templateUrl: './accessary.component.html',
  styleUrls: ['./accessary.component.scss']
})
export class AccessaryComponent implements OnInit , OnChanges {
  @Input() detailData;
  fieldGrid: Array<any>;
  selectedData: ContactCustomModel;
  gridParams;
  selectRowGrid;
  constructor() {
    this.fieldGrid = [
      {headerName : 'Loại hình sửa chữa' , field : 'typeRepair'},
      {headerName : 'Lệnh SC' , field : 'commandRepair'},
      {headerName : 'Cố vấn dịch vụ' , field : 'serviceAdvisor'},
      {headerName : 'Mã phụ tùng' , field : 'accessaryCode'},
      {headerName : 'Tên phụ tùng' , field : 'accessaryName'},
      {headerName : 'Số lượng' , field : 'amount'},
      {headerName : 'Giá bán' , field : 'accessaryPrice'},
      {headerName : 'Thành tiền' , field : 'accessaryPriceTotal'},
      {headerName : 'Thuế' , field : 'taxAccessary'}
    ];
  }

  ngOnInit() {
  }
  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectRowGrid = selectedData[0];
    }
  }

}
