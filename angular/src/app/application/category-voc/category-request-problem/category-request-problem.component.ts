import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { CategoryRequestProblemModel } from '../../../core/models/category-voc/category-request-problem.model';
import { CategoryComplainProblemModel } from '../../../core/models/category-voc/category-complain-problem.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-request-problem',
  templateUrl: './category-request-problem.component.html',
  styleUrls: ['./category-request-problem.component.scss'],
})
export class CategoryRequestProblemComponent implements OnInit {

  @Input() categoryComplainProblem;
  @ViewChild('complainProblemModal', {static: false}) complainProblemModal;
  @ViewChild('requestProblemModal', {static: false}) requestProblemModal;
  fieldGrid;
  gridParams;
  selectedRowData: CategoryRequestProblemModel;
  selectedRowDataComplain: CategoryComplainProblemModel;
  data;

  constructor(
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.data = [
      {
        nameComplainField: 'field1',
        codeComplainProblem: 'problem code 123',
        nameComplainProblem: 'problem name 445',
        status: 'Deactive',
        stt: '2',
        description: 'code name deavtive',
      },
    ];
    if (this.categoryComplainProblem) {
      this.fieldGrid = [
        {headerName: 'Tên lĩnh vực khiếu nại', headerTooltip: 'Tên lĩnh vực khiếu nại', field: 'nameComplainField'},
        {headerName: 'Mã vấn đề khiếu nại', headerTooltip: 'Mã vấn đề khiếu nại', field: 'codeComplainProblem'},
        {headerName: 'Tên vấn đề khiếu nại', headerTooltip: 'Tên vấn đề khiếu nại', field: 'nameComplainProblem'},
        {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
        {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'stt'},
        {headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'description'},
      ];
    } else {
      this.fieldGrid = [
        {headerName: 'Tên lĩnh vực thắc mắc', headerTooltip: 'Tên lĩnh vực thắc mắc', field: 'nameRequestField'},
        {headerName: 'Mã vấn đề thắc mắc', headerTooltip: 'Mã vấn đề thắc mắc', field: 'codeRequestProblem'},
        {headerName: 'Tên vấn đề thắc mắc', headerTooltip: 'Tên vấn đề thắc mắc', field: 'nameRequestProblem'},
        {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
        {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'stt'},
        {headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'description'},
      ];
    }
  }

  callbackGrid(params) {
    this.gridParams = params;
    if (this.categoryComplainProblem) {
      this.gridParams.api.setRowData(this.data);
    } else {
      this.gridParams.api.setRowData();
    }
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      if (this.categoryComplainProblem) {
        this.selectedRowDataComplain = selectedData[0];
      } else {
        this.selectedRowData = selectedData[0];
      }
    }
  }

  openAddModal() {
    if (this.categoryComplainProblem) {
      this.complainProblemModal.open();
    } else {
      this.requestProblemModal.open();
    }
    this.gridParams.api.updateRowData({add: [{}]});
  }

  openEditModal() {
    if (this.categoryComplainProblem) {
      this.selectedRowDataComplain
        ? this.complainProblemModal.open(this.selectedRowDataComplain)
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
    } else {
      this.selectedRowData
        ? this.requestProblemModal.open(this.selectedRowData)
        : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
    }
  }

  onDelRow() {
    if (this.categoryComplainProblem) {
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
