import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { ManageDocumentSupportModel } from '../../../core/models/manage-voc/manage-document-support.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'manage-document-support',
  templateUrl: './manage-document-support.component.html',
  styleUrls: ['./manage-document-support.component.scss'],
})
export class ManageDocumentSupportComponent implements OnInit {

  @ViewChild('addDocumentDetailModal', {static: false}) addDocumentDetailModal;
  @ViewChild('addDocumentModal', {static: false}) addDocumentModal;
  form: FormGroup;
  fieldGird;
  fieldGridDetail;
  gridParams;
  gridParamsDetail;
  selectedRowData: ManageDocumentSupportModel;
  selectedRowDataDetail: ManageDocumentSupportModel;
  editModal = true;
  editDetailModal = true;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGird = [
      {headerName: 'Tên tài liệu', headerTooltip: 'Tên tài liệu', field: 'documentName'},
      {headerName: 'Model', headerTooltip: 'Model', field: 'model'},
      {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
      {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'stt'},
    ];

    this.fieldGridDetail = [
      {headerName: 'Tài liệu', headerTooltip: 'Tài liệu', field: 'document'},
      {headerName: 'Tiêu đề', headerTooltip: 'Tiêu đề', field: 'title'},
      {headerName: 'Từ khóa', headerTooltip: 'Từ khóa', field: 'keyword'},
      {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
    ];
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

  search() {
    this.gridParams.api.updateRowData({add: [{}]});
    this.gridParamsDetail.api.updateRowData({add: [{}]});
  }

  onAdd() {
    this.addDocumentModal.open();
  }

  onEdit() {
    this.selectedRowData
      ? this.addDocumentModal.open(this.selectedRowData, this.editModal)
      : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
  }

  onDel() {
    this.selectedRowData
      ? this.confirm.openConfirmModal('Xác nhận?', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        this.gridParams.api.updateRowData({remove: [this.selectedRowData]});
      })
      : this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa!', 'Thông báo!');
  }

  callbackGridDetail(params) {
    this.gridParamsDetail = params;
    this.gridParamsDetail.api.setRowData();
  }

  getParamsDetail() {
    const selectedData = this.gridParamsDetail.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowDataDetail = selectedData[0];
    }
  }

  onAddDetail() {
    this.addDocumentDetailModal.open();
  }

  onEditDetail() {
    this.selectedRowDataDetail
      ? this.addDocumentDetailModal.open(this.selectedRowDataDetail, this.editDetailModal)
      : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
  }

  onDelDetail() {
    this.selectedRowDataDetail
      ? this.confirm.openConfirmModal('Xác nhận!', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        this.gridParamsDetail.api.updateRowData({remove: [this.selectedRowDataDetail]});
      })
      : this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa!', 'Thông báo!');
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      model: [undefined],
      title: [undefined],
    });
  }
}
