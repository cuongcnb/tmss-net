import { Component, OnInit, ViewChild } from '@angular/core';
import { FirCategoryModel } from '../../../core/models/fir-category/fir-category.model';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'error-cause',
  templateUrl: './error-cause.component.html',
  styleUrls: ['./error-cause.component.scss'],
})
export class ErrorCauseComponent implements OnInit {

  @ViewChild('errorCauseModal', {static: false}) errorCauseModal;
  gridParams;
  fieldGrid;
  selectedRowGrid: FirCategoryModel;
  dataGrid = [
    {
      errorName: 'Bộ phận 1',
      isStatus: 'Hết hiệu lực',
      isSerial: '1',
      isDescribe: 'Mô tả 1',
    },
    {
      errorName: 'Bộ phận 2',
      isStatus: 'Còn hiệu lực',
      isSerial: '2',
      isDescribe: 'Mô tả 2',
    },
    {
      errorName: 'Bộ phận 3',
      isStatus: 'Hết hiệu lực',
      isSerial: '3',
      isDescribe: 'Mô tả 3',
    },
  ];

  constructor(
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Tên bộ phận gây lỗi', headerTooltip: 'Tên bộ phận gây lỗi', field: 'errorName'},
      {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'isStatus'},
      {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'isSerial'},
      {headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'isDescribe'},
    ];
  }

  refresh() {
    this.selectedRowGrid = undefined;
    this.gridParams.api.setRowData(this.dataGrid);
  }

  addNew(data) {
    this.dataGrid.push(data);
    this.refresh();
  }


  editRow() {
    if (this.selectedRowGrid) {
      this.errorCauseModal.open(this.selectedRowGrid);
    } else {
      this.swalAlert.openWarningToast('Bạn phải chọn 1 dòng');
    }
  }

  update(selectedData) {
    this.dataGrid = this.dataGrid.map(data => {
      // @ts-ignore
      return data === this.selectedRowGrid ? selectedData : data;
    });
    this.refresh();
  }

  deleteRow() {
    if (this.selectedRowGrid) {
      this.confirm.openConfirmModal('Question?', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        // @ts-ignore
        this.dataGrid = this.dataGrid.filter(data => data !== this.selectedRowGrid);
        this.refresh();
      });
    } else {
      this.swalAlert.openWarningToast('Bạn phải chọn 1 dòng');
    }
  }

  search() {
    this.swalAlert.openSuccessToast('Cập nhật thành công');
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData(this.dataGrid);
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowGrid = selectedData[0];
    }
  }

  insertData(params) {
    if (this.selectedRowGrid) {
      this.errorCauseModal.open(this.selectedRowGrid);
    }
  }
}
