import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'appointmennt-in-day-tab',
  templateUrl: './appointmennt-in-day-tab.component.html',
  styleUrls: ['./appointmennt-in-day-tab.component.scss']
})
export class AppointmenntInDayTabComponent {
  fieldGrid;

  constructor() {
    this.fieldGrid = [
      { headerName: 'Ngày mở LSC', headerTooltip: 'Ngày mở LSC', field: 'openLscDate'},
      { headerName: 'Số LSC', headerTooltip: 'Số LSC', field: 'lscNumber'},
      { headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'licensePlate'},
      { headerName: 'Tên khách hàng', headerTooltip: 'Tên khách hàng', field: 'customerName'},
      { headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'phoneNumber'},
      { headerName: 'Mã số thuế', headerTooltip: 'Mã số thuế', field: 'taxCode'},
      { headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'state'},
    ];
  }

}
