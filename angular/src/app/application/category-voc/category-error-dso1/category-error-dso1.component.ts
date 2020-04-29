import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CategoryErrorDso1Model } from '../../../core/models/category-voc/category-error-dso1.model';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-error-dso1',
  templateUrl: './category-error-dso1.component.html',
  styleUrls: ['./category-error-dso1.component.scss'],
})
export class CategoryErrorDso1Component implements OnInit {

  @Input() errorDSO2: boolean;
  @Input() reasonDSO1: boolean;
  @Input() reasonDSO2: boolean;
  @ViewChild('errorDSO1Modal', {static: false}) errorDSO1Modal;
  @ViewChild('errorDSO2Modal', {static: false}) errorDSO2Modal;
  @ViewChild('reasonDSO1Modal', {static: false}) reasonDSO1Modal;
  @ViewChild('reasonDSO2Modal', {static: false}) reasonDSO2Modal;
  fieldGrid;
  gridParams;
  selectedRowData: CategoryErrorDso1Model;
  hidden = false;

  constructor(
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    if (this.errorDSO2) {
      this.fieldGrid = [
        {headerName: 'Tên loại lỗi DSO 1', headerTooltip: 'Tên loại lỗi DSO 1', field: 'nameDSO1'},
        {headerName: 'Mã loại lỗi DSO 2', headerTooltip: 'Mã loại lỗi DSO 2', field: 'codeDSO2'},
        {headerName: 'Tên loại lỗi DSO 2', headerTooltip: 'Tên loại lỗi DSO 2', field: 'nameDSO2'},
        {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
        {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'stt'},
        {headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'description'},
      ];
    } else if (this.reasonDSO1) {
      this.fieldGrid = [
        {headerName: 'Tên loại lỗi DSO 1', headerTooltip: 'Tên loại lỗi DSO 1', field: 'nameDSO1'},
        {headerName: 'Tên loại lỗi DSO 2', headerTooltip: 'Tên loại lỗi DSO 2', field: 'nameDSO2'},
        {headerName: 'Tên nguyên nhân DSO 1', headerTooltip: 'Tên nguyên nhân DSO 1', field: 'nameReasonDSO1'},
        {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
        {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'stt'},
      ];
    } else if (this.reasonDSO2) {
      this.fieldGrid = [
        {headerName: 'Tên loại lỗi DSO 1', headerTooltip: 'Tên loại lỗi DSO 1', field: 'nameDSO1'},
        {headerName: 'Tên loại lỗi DSO 2', headerTooltip: 'Tên loại lỗi DSO 2', field: 'nameDSO2'},
        {headerName: 'Tên nguyên nhân DSO 1', headerTooltip: 'Tên nguyên nhân DSO 1', field: 'nameReasonDSO1'},
        {headerName: 'Tên nguyên nhân DSO 2', headerTooltip: 'Tên nguyên nhân DSO 2', field: 'nameReasonDSO2'},
        {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
        {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'stt'},
      ];
    } else {
      this.fieldGrid = [
        {headerName: 'Mà loại lỗi DSO 1', headerTooltip: 'Mà loại lỗi DSO 1', field: 'codeDSO1'},
        {headerName: 'Tên loại lỗi DSO 1', headerTooltip: 'Tên loại lỗi DSO 1', field: 'nameDSO1'},
        {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
        {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'stt'},
        {headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'description'},
      ];
    }

    if (this.reasonDSO1) {
      this.hidden = true;
    }
    if (this.reasonDSO2) {
      this.hidden = true;
    }
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowData = selectedData[0];
    }
  }

  openAddModal() {

    if (this.errorDSO2) {
      this.errorDSO2Modal.open();
    } else if (this.reasonDSO1) {
      this.reasonDSO1Modal.open();
    } else if (this.reasonDSO2) {
      this.reasonDSO2Modal.open();
    } else {
      this.errorDSO1Modal.open();
    }
    this.gridParams.api.updateRowData({add: [{}]});
  }

  openEditModal() {
    if (this.errorDSO2) {
      this.selectedRowData
        ? this.errorDSO2Modal.open(this.selectedRowData)
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
    } else if (this.reasonDSO1) {
      this.selectedRowData
        ? this.reasonDSO1Modal.open(this.selectedRowData)
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
    } else if (this.reasonDSO2) {
      this.selectedRowData
        ? this.reasonDSO2Modal.open(this.selectedRowData)
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
    } else {
      this.selectedRowData
        ? this.errorDSO1Modal.open(this.selectedRowData)
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
    }
  }

  onDelRow() {
    this.selectedRowData
      ? this.confirm.openConfirmModal('Xác nhận!', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        this.gridParams.api.updateRowData({remove: [this.selectedRowData]});
      })
      : this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa!', 'Thông báo!');
  }

}
