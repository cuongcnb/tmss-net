import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { CategoryRequestFieldModel } from '../../../core/models/category-voc/category-request-field.model';
import { CategoryComplainFieldModel } from '../../../core/models/category-voc/category-complain-field.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-request-field',
  templateUrl: './category-request-field.component.html',
  styleUrls: ['./category-request-field.component.scss'],
})
export class CategoryRequestFieldComponent implements OnInit {

  @ViewChild('complainFieldModal', {static: false}) complainFieldModal;
  @ViewChild('requestFieldModal', {static: false}) requestFieldModal;
  @Input() categoryComplainField: string;
  fieldGrid;
  gridParams;
  selectedRowData: CategoryRequestFieldModel;
  selectedRowDataComplain: CategoryComplainFieldModel;
  data: Array<any> = [];

  constructor(
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.data = [
      {
        codeComplainField: 'code 112',
        nameComplainField: 'name sákdsa',
        status: 'Active',
        stt: '0',
        description: 'code name name code 213',
      },
    ];
    if (this.categoryComplainField) {
      this.fieldGrid = [
        {headerName: 'Mã lĩnh vực khiếu nại', headerTooltip: 'Mã lĩnh vực khiếu nại', field: 'codeComplainField'},
        {headerName: 'Tên lĩnh vực khiếu nại', headerTooltip: 'Tên lĩnh vực khiếu nại', field: 'nameComplainField'},
        {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
        {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'stt'},
        {headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'description'},
      ];
    } else {
      this.fieldGrid = [
        {headerName: 'Mã lĩnh vực thắc mắc', headerTooltip: 'Mã lĩnh vực thắc mắc', field: 'codeRequestField'},
        {headerName: 'Tên lĩnh vực thắc mắc', headerTooltip: 'Tên lĩnh vực thắc mắc', field: 'nameRequestField'},
        {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
        {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'stt'},
        {headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'description'},
      ];
    }
  }

  callbackGrid(params) {
    this.gridParams = params;
    if (this.categoryComplainField) {
      this.gridParams.api.setRowData(this.data);
    } else {
      this.gridParams.api.setRowData();
    }
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      if (this.categoryComplainField) {
        this.selectedRowDataComplain = selectedData[0];
      } else {
        this.selectedRowData = selectedData[0];
      }
    }
  }

  openAddModal() {
    if (this.categoryComplainField) {
      this.complainFieldModal.open();
    } else {
      this.requestFieldModal.open();
    }
    this.gridParams.api.updateRowData({add: [{}]});
  }

  openEditModal() {
    if (this.selectedRowDataComplain) {
      this.selectedRowDataComplain
        ? this.complainFieldModal.open(this.selectedRowDataComplain)
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
    } else {
      this.selectedRowData
        ? this.requestFieldModal.open(this.selectedRowData)
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
    }
  }

  onDelRow() {
    if (this.selectedRowDataComplain) {
      this.selectedRowDataComplain
        ? this.confirm.openConfirmModal('Xác nhận!', 'Bạn có muốn xóa dòng này?').subscribe(() => {
          this.gridParams.api.updateRowData({remove: [this.selectedRowDataComplain]});
        })
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa!', 'Thông báo!');
    } else {
      this.selectedRowData
        ? this.confirm.openConfirmModal('Xác nhận!', 'Bạn có muốn xóa dòng này?').subscribe(() => {
          this.gridParams.api.updateRowData({remove: [this.selectedRowData]});
        })
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa!', 'Thông báo!');
    }
  }
}
