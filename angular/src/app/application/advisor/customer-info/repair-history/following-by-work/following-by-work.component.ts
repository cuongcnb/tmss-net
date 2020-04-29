import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'following-by-work',
  templateUrl: './following-by-work.component.html',
  styleUrls: ['./following-by-work.component.scss'],
})
export class FollowingByWorkComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  height = '450px';
  selectedTab: string;
  tabs: Array<string>;

  repairFieldGrid;
  dongsonFieldGrid;

  constructor() {
  }

  ngOnInit() {
    this.initTabs();
    this.initGrid();
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }

  private initTabs() {
    this.tabs = ['Sửa chữa chung', 'Đồng Sơn'];
    this.selectedTab = this.tabs[0];
  }

  private initGrid() {
    this.repairFieldGrid = [
      {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: ''},
      {headerName: 'Số lệnh SC', headerTooltip: 'Số lệnh SC', field: ''},
      {headerName: 'Ngày xe đến', headerTooltip: 'Ngày xe đến', field: ''},
      {headerName: 'Ngày ra xe', headerTooltip: 'Ngày ra xe', field: ''},
      {headerName: 'Mã CV', headerTooltip: 'Mã công việc', field: ''},
      {headerName: 'Tên CV', headerTooltip: 'Tên công việc', field: ''},
      {headerName: 'Kiểu CV', headerTooltip: 'Kiểu công việc', field: ''},
      {headerName: 'Kiểu CV t/ngoài', headerTooltip: 'Kiểu công việc t/ngoài', field: ''},
      {
        headerName: 'Giờ công',
        headerTooltip: 'Giờ công',
        children: [
          {headerName: 'D/m', headerTooltip: 'D/m', field: ''},
          {headerName: 'H/S', headerTooltip: 'H/S', field: ''},
          {headerName: 'TT', headerTooltip: 'TT', field: ''},
        ],
      },
      {headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: ''},
      {headerName: 'Thuế (%)', headerTooltip: 'Thuế (%)', field: ''},
      {
        headerName: 'Sửa lại', headerTooltip: 'Sửa lại', field: 'checked',
        cellRenderer: params => `<input disabled type="checkbox" ${params.data.checked ? 'checked' : ''}/>`,
      },
      {
        headerName: '',
        headerTooltip: '',
        cellRenderer: () => `<button class="btn btn-blue">Copy</button>`,
      },
    ];

    this.dongsonFieldGrid = [
      {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: ''},
      {headerName: 'Số lệnh SC', headerTooltip: 'Số lệnh SC', field: ''},
      {headerName: 'Ngày xe đến', headerTooltip: 'Ngày xe đến', field: ''},
      {headerName: 'Ngày ra xe', headerTooltip: 'Ngày ra xe', field: ''},
      {headerName: 'Tên CV', headerTooltip: 'Tên CV', field: ''},
      {headerName: 'Kiểu CV t/ngoài', headerTooltip: 'Kiểu CV t/ngoài', field: ''},
      {headerName: 'Nhóm CV', headerTooltip: 'Nhóm CV', field: ''},
      {headerName: 'DT/ Phạm vi', headerTooltip: 'DT/ Phạm vi', field: ''},
      {headerName: 'Độ khó/ Kiểu CV', headerTooltip: 'Độ khó/ Kiểu CV', field: ''},
      {headerName: 'D/M giờ công', headerTooltip: 'D/M giờ công', field: ''},
      {headerName: 'Giờ công TT', headerTooltip: 'Giờ công TT', field: ''},
      {headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: ''},
      {headerName: 'Chi phí VT', headerTooltip: 'Chi phí VT', field: ''},
      {headerName: 'Thuế (%)', headerTooltip: 'Thuế (%)', field: ''},
      {
        headerName: 'Sửa lại', headerTooltip: 'Sửa lại', field: 'checked',
        cellRenderer: params => `<input disabled type="checkbox" ${params.data.checked ? 'checked' : ''}/>`,
      },
    ];
  }
}
