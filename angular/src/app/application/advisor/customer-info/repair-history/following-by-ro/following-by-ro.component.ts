import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'following-by-ro',
  templateUrl: './following-by-ro.component.html',
  styleUrls: ['./following-by-ro.component.scss'],
})
export class FollowingByRoComponent implements OnInit {
  height = '250px';
  selectedTab: string;
  tabs: Array<string>;

  fieldGrid;
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
    this.fieldGrid = [
      {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'dealer'},
      {headerName: 'Số lệnh SC', headerTooltip: 'Số lệnh SC', field: 'scNo'},
      {headerName: 'Ngày xe đến', headerTooltip: 'Ngày xe đến', field: ''},
      {headerName: 'Ngày ra xe', headerTooltip: 'Ngày ra xe', field: ''},
      {headerName: 'Số KM', headerTooltip: 'Số KM', field: ''},
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: ''},
      {headerName: 'KTV', headerTooltip: 'KTV', field: ''},
      {headerName: 'Nội dung SC', headerTooltip: 'Nội dung SC', field: ''},
    ];

    this.repairFieldGrid = [
      {headerName: 'Mã CV', headerTooltip: 'Mã công việc', field: 'workCode'},
      {headerName: 'Tên CV', headerTooltip: 'Tên công việc', field: 'workName'},
      {headerName: 'Kiểu CV thuê ngoài', headerTooltip: 'Kiểu CV thuê ngoài', field: ''},
      {headerName: 'Kiểu CV', headerTooltip: 'Kiểu công việc', field: ''},
      {
        headerName: 'Giờ công',
        headerTooltip: 'Giờ công',
        children: [
          {headerName: 'Đ/m', headerTooltip: 'Đ/m', field: ''},
          {headerName: 'H/S', headerTooltip: 'H/S', field: ''},
          {headerName: 'TT', headerTooltip: 'TT', field: ''},
        ],
      },
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: ''},
      {headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: ''},
      {
        headerName: 'Giảm giá',
        headerTooltip: 'Giảm giá',
        children: [
          {headerName: '(%)', headerTooltip: '(%)', field: ''},
          {headerName: 'Giá trị', headerTooltip: 'Giá trị', field: ''},
        ],
      },
      {
        headerName: 'Sửa lại', headerTooltip: 'Sửa lại', field: 'checked',
        cellRenderer: params => `<input disabled type="checkbox" ${params.data.checked ? 'checked' : ''}/>`,
      },
      {
        headerName: '',
        cellRenderer: () => `<button class="btn btn-blue">Copy</button>`,
      },
    ];

    this.dongsonFieldGrid = [
      {headerName: 'Tên CV', headerTooltip: 'Tên công việc', field: ''},
      {headerName: 'Nhóm CV', headerTooltip: 'Nhóm công việc', field: ''},
      {headerName: 'Kiểu CV thuê ngoài', headerTooltip: 'Kiểu công việc thuê ngoài', field: ''},
      {headerName: 'DT/ Phạm vi', headerTooltip: 'DT/ Phạm vi', field: ''},
      {headerName: 'Độ khó/ Kiểu CV', headerTooltip: 'Độ khó/ Kiểu CV', field: ''},
      {headerName: 'T/g t/c', headerTooltip: 'T/g t/c', field: ''},
      {headerName: 'T/g dlr', headerTooltip: 'T/g dlr', field: ''},
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: ''},
      {headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: ''},
      {headerName: 'C/p dlr', headerTooltip: 'C/p dlr', field: ''},
      {
        headerName: 'Giảm giá',
        headerTooltip: 'Giảm giá',
        children: [
          {headerName: '(%)', headerTooltip: '(%)', field: ''},
          {headerName: 'Giá trị', headerTooltip: 'Giá trị', field: ''},
        ],
      },
      {
        headerName: 'Sửa lại', headerTooltip: 'Sửa lại', field: 'checked',
        cellRenderer: params => `<input disabled type="checkbox" ${params.data.checked ? 'checked' : ''}/>`,
      },
    ];
  }
}
