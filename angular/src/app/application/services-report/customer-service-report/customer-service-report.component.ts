import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'customer-service-report',
  templateUrl: './customer-service-report.component.html',
  styleUrls: ['./customer-service-report.component.scss'],
})
export class CustomerServiceReportComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  tabs: Array<any>;
  selectedTab;
  modalHeight: number;
  requiredGridField;
  requiredGridParams;
  requiredSelectedData;
  diaryGridField;

  constructor(
    private modalHeightService: SetModalHeightService,
    private gridTableService: GridTableService,
  ) {
  }

  ngOnInit() {
    this.onResize();
    this.initGrid();
    this.initTabs();
    this.selectedTab = this.tabs[0];
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }

  open() {
    this.initGrid();
    this.modal.show();
  }

  callbackRequiredGrid(params) {
    this.requiredGridParams = params;
    params.api.setRowData();
  }

  getRequiredParams() {
    const selected = this.requiredGridParams.api.getSelectedRows();
    if (selected) {
      this.requiredSelectedData = selected[0];
    }
  }

  addRow() {
    const blankData = {
      dealer: undefined,
      fromDate: undefined,
      toDate: undefined,
    };
    this.requiredGridParams.api.updateRowData({add: [blankData]});
  }

  delRow() {
    this.requiredGridParams.api.updateRowData({remove: [this.requiredSelectedData]});
    this.requiredSelectedData = undefined;
  }


  save() {
    this.requiredGridParams.api.setRowData();
    this.modal.hide();
  }

  private initTabs() {
    this.tabs = ['Yêu cầu', 'Nhật kí'];
  }

  private initGrid() {
    this.requiredGridField = [
      {
        headerName: 'Đại lý',
        headerTooltip: 'Đại lý',
        field: 'dealer',
        minWidth: 200,
        editable: true,
      },
      {
        headerName: 'Từ ngày',
        headerTooltip: 'Từ ngày',
        field: 'fromDate',
        minWidth: 200,
        editable: true,
      },
      {
        headerName: 'Đến ngày',
        headerTooltip: 'Đến ngày',
        field: 'toDate',
        minWidth: 200,
        editable: true,
      },
    ];
    this.diaryGridField = [
      {
        headerName: 'Ngày tạo yêu cầu',
        headerTooltip: 'Ngày tạo yêu cầu',
        field: '',
        minWidth: 200,
      },
      {
        headerName: ' Điều kiện lọc',
        headerTooltip: ' Điều kiện lọc',
        children: [
          {
            headerName: 'Đại lý',
            headerTooltip: 'Đại lý',
            field: '',
            minWidth: 200,
          },
          {
            headerName: 'Từ ngày',
            headerTooltip: 'Từ ngày',
            field: '',
            minWidth: 200,
          },
          {
            headerName: 'Đến ngày',
            headerTooltip: 'Đến ngày',
            field: '',
            minWidth: 200,
          },
        ],
      },
      {
        headerName: 'Đường dẫn/ Lượt xe dịch vụ',
        headerTooltip: 'Đường dẫn/ Lượt xe dịch vụ',
        field: '',
        minWidth: 200,
      },
      {
        headerName: 'Đường dẫn/ Khách hàng dịch vụ',
        headerTooltip: 'Đường dẫn/ Khách hàng dịch vụ',
        field: '',
        minWidth: 200,
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: '',
        minWidth: 200,
      },
    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }
}

