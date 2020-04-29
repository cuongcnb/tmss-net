import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { CategoryPartsDamagedModel } from '../../../core/models/category-voc/category-parts-damaged.model';
import { CategoryPhenomenaDamagedModel } from '../../../core/models/category-voc/category-phenomena-damaged.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-parts-damaged',
  templateUrl: './category-parts-damaged.component.html',
  styleUrls: ['./category-parts-damaged.component.scss'],
})
export class CategoryPartsDamagedComponent implements OnInit {

  @Input() phenomenaDamaged;
  @ViewChild('partsDamagedModal', {static: false}) partsDamagedModal;
  @ViewChild('phenomenaDamagedModal', {static: false}) phenomenaDamagedModal;
  fieldGrid;
  gridParams;
  selectedRowData: CategoryPartsDamagedModel;
  selectedRowDataPhenomena: CategoryPhenomenaDamagedModel;

  constructor(
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    if (this.phenomenaDamaged) {
      this.fieldGrid = [
        {headerName: 'Tên lĩnh vực khiếu nại', headerTooltip: 'Tên lĩnh vực khiếu nại', field: 'nameComlainField'},
        {headerName: 'Tên vấn đề khiếu nại', headerTooltip: 'Tên vấn đề khiếu nại', field: 'nameComplainProblem'},
        {headerName: 'Tên bộ phận hư hỏng/Quy trình', headerTooltip: 'Tên bộ phận hư hỏng/Quy trình', field: 'namePartsDamaged'},
        {headerName: 'Tên hiện tượng hư hỏng/Quy trình phụ', headerTooltip: 'Tên hiện tượng hư hỏng/Quy trình phụ', field: 'namePhenomenaDamaged'},
        {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
        {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'stt'},
      ];
    } else {
      this.fieldGrid = [
        {headerName: 'Tên lĩnh vực khiếu nại', headerTooltip: 'Tên lĩnh vực khiếu nại', field: 'nameComlainField'},
        {headerName: 'Tên vấn đề khiếu nại', headerTooltip: 'Tên vấn đề khiếu nại', field: 'nameComplainProblem'},
        {headerName: 'Tên bộ phận hư hỏng/Quy trình', headerTooltip: 'Tên bộ phận hư hỏng/Quy trình', field: 'namePartsDamaged'},
        {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
        {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'stt'},
      ];
    }
  }

  callbackGrid(params) {
    this.gridParams = params;
    if (this.phenomenaDamaged) {
      this.gridParams.api.setRowData();
    } else {
      this.gridParams.api.setRowData();
    }

  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      if (this.phenomenaDamaged) {
        this.selectedRowDataPhenomena = selectedData[0];
      } else {
        this.selectedRowData = selectedData[0];
      }
    }
  }

  openAddModal() {
    if (this.phenomenaDamaged) {
      this.phenomenaDamagedModal.open();
    } else {
      this.partsDamagedModal.open();
    }
    this.gridParams.api.updateRowData({add: [{}]});
  }

  openEditModal() {
    if (this.phenomenaDamaged) {
      this.selectedRowDataPhenomena
        ? this.phenomenaDamagedModal.open(this.selectedRowDataPhenomena)
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
    } else {
      this.selectedRowData
        ? this.partsDamagedModal.open(this.selectedRowData)
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
    }
  }

  onDelRow() {
    if (this.phenomenaDamaged) {
      this.selectedRowDataPhenomena
        ? this.confirm.openConfirmModal('Xác nhận!', 'Bạn có muốn xóa dòng này?').subscribe(() => {
          this.gridParams.api.updateRowData({remove: [this.selectedRowDataPhenomena]});
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
