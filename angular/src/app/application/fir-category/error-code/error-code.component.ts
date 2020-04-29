import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FirCategoryModel } from '../../../core/models/fir-category/fir-category.model';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'error-code',
  templateUrl: './error-code.component.html',
  styleUrls: ['./error-code.component.scss'],
})
export class ErrorCodeComponent implements OnInit {
  @Input() isAgencyContactQuestions: boolean;
  @ViewChild('errorCodeModal', {static: false}) errorCodeModal;
  gridParams;
  fieldGrid;
  selectedRowGrid: FirCategoryModel;
  dataGrid = [
    {
      errorName: 'Bộ phận 1',
      errorField: 'Lĩnh vực 1',
      errorCause: 'Nguyên nhân 1',
      codeCause: 'Mã 1',
      coreReason: 'Nguyên nhân cốt lõi 1',
      isStatus: 'Hết hiệu lực',
      isSerial: '1',
      isDescribe: 'Mô tả 1',
    },
    {
      errorName: 'Bộ phận 2',
      errorField: 'Lĩnh vực 2',
      errorCause: 'Nguyên nhân 2',
      codeCause: 'Mã 2',
      coreReason: 'Nguyên nhân cốt lõi 2',
      isStatus: 'Còn hiệu lực',
      isSerial: '2',
      isDescribe: 'Mô tả 2',
    },
    {
      errorName: 'Bộ phận 3',
      errorField: 'Lĩnh vực 3',
      errorCause: 'Nguyên nhân 3',
      codeCause: 'Mã 3',
      coreReason: 'Nguyên nhân cốt lõi 3',
      isStatus: 'Hết hiệu lực',
      isSerial: '3',
      isDescribe: 'Mô tả 3',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Tên bộ phận gây lỗi', headerTooltip: 'Tên bộ phận gây lỗi', field: 'errorName'},
      {headerName: 'Lĩnh vực lỗi', headerTooltip: 'Lĩnh vực lỗi', field: 'errorField'},
      {headerName: 'Nguyên nhân lỗi', headerTooltip: 'Nguyên nhân lỗi', field: 'errorCause'},
      {headerName: 'Mã lỗi', headerTooltip: 'Mã lỗi', field: 'codeCause'},
      {headerName: 'Nguyên nhân cốt lõi', headerTooltip: 'Nguyên nhân cốt lõi', field: 'coreReason'},
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
      this.errorCodeModal.open(this.selectedRowGrid);
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
}
