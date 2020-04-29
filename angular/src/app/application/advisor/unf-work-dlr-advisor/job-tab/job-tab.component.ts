import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'job-tab',
  templateUrl: './job-tab.component.html',
  styleUrls: ['./job-tab.component.scss']
})
export class JobTabComponent {
  fieldGrid;

  constructor() {
    this.fieldGrid = [
      { headerName: 'Kiểu CV', headerTooltip: 'Kiểu CV', field: 'jobType'},
      { headerName: 'Công việc', headerTooltip: 'Công việc', field: 'job'},
      { headerName: 'Giờ công', headerTooltip: 'Giờ công', field: 'labourHour'},
      { headerName: 'Thuế', headerTooltip: 'Thuế', field: 'tax'},
      { headerName: 'Tổng tiền', headerTooltip: 'Tổng tiền', field: 'totalAmount'}
    ];
  }

}
