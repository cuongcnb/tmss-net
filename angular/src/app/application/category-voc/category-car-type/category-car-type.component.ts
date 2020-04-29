import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CategoryCarTypeModel } from '../../../core/models/category-voc/category-car-type.model';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-car-type',
  templateUrl: './category-car-type.component.html',
  styleUrls: ['./category-car-type.component.scss'],
})
export class CategoryCarTypeComponent implements OnInit {

  @Input() specifications: boolean;
  @Input() carModel: boolean;
  @ViewChild('specificationsModal', {static: false}) specificationsModal;
  @ViewChild('carTypeModal', {static: false}) carTypeModal;
  @ViewChild('carModelModal', {static: false}) carModelModal;
  fieldGrid;
  gridParams;
  selectedRowData: CategoryCarTypeModel;

  constructor(
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    if (this.carModel) {
      this.fieldGrid = [
        {headerName: 'Dòng xe', headerTooltip: 'Dòng xe', field: 'nameCarType'},
        {headerName: 'Mã loại xe', headerTooltip: 'Mã loại xe', field: 'codeCarModel'},
        {headerName: 'Mã marketing', headerTooltip: 'Mã marketing', field: 'codeMarketing'},
        {headerName: 'Tên loại xe', headerTooltip: 'Tên loại xe', field: 'nameCarModel'},
        {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
        {headerName: 'Số thứ tự', headerTooltip: 'Số thứ tự', field: 'stt'},
      ];
    } else if (this.specifications) {
      this.fieldGrid = [
        {headerName: 'Tên danh mục', headerTooltip: 'Tên danh mục', field: 'nameCategory'},
        {headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'description'},
        {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
      ];
    } else {
      this.fieldGrid = [
        {headerName: 'Mã dòng xe', headerTooltip: 'Mã dòng xe', field: 'codeCarType'},
        {headerName: 'Mã marketing', headerTooltip: 'Mã marketing', field: 'codeMarketing'},
        {headerName: 'Tên dòng xe', headerTooltip: 'Tên dòng xe', field: 'nameCarType'},
        {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
        {headerName: 'Số thứ tự', headerTooltip: 'Số thứ tự', field: 'stt'},
      ];
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
    if (this.carModel) {
      this.carModelModal.open();
    } else if (this.specifications) {
      this.specificationsModal.open();
    } else {
      this.carTypeModal.open();
    }
    this.gridParams.api.updateRowData({add: [{}]});
  }

  openEditModal() {
    if (this.carModel) {
      this.selectedRowData
        ? this.carModelModal.open(this.selectedRowData)
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
    } else if (this.specifications) {
      this.selectedRowData
        ? this.specificationsModal.open(this.selectedRowData)
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
    } else {
      this.selectedRowData
        ? this.carTypeModal.open(this.selectedRowData)
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
    }
  }

  onDelRow() {
    this.selectedRowData
      ? this.confirm.openConfirmModal('Xác nhận!', 'Hãy chọn dòng cần xóa!').subscribe(() => {
        this.gridParams.api.updateRowData({remove: [this.selectedRowData]});
      })
      : this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa!', 'Thông báo');
  }

}
