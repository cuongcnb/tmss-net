import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-tab',
  templateUrl: './part-tab.component.html',
  styleUrls: ['./part-tab.component.scss']
})
export class PartTabComponent {
  fieldGrid;

  constructor() {
    this.fieldGrid = [
      { headerName: 'Mã phụ tùng', headerTooltip: 'Mã phụ tùng', field: 'partCode'},
      { headerName: 'Tên phụ tùng', headerTooltip: 'Tên phụ tùng', field: 'partName'},
      { headerName: 'C/hãng', headerTooltip: 'C/hãng', field: 'origin'},
      { headerName: 'Loại PT', headerTooltip: 'Loại phụ tùng', field: 'partType'},
      { headerName: 'Đơn vị', headerTooltip: 'Đơn vị', field: 'unit'},
      { headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'quantity'},
      { headerName: 'Thuế', headerTooltip: 'Thuế', field: 'tax'},
      { headerName: 'Tổng tiền', headerTooltip: 'Tổng tiền', field: 'totalAmount'}
    ];
  }

}
