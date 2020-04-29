import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { ManageFaqModel } from '../../../core/models/manage-voc/manage-faq.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'manage-faq',
  templateUrl: './manage-faq.component.html',
  styleUrls: ['./manage-faq.component.scss'],
})
export class ManageFaqComponent implements OnInit {

  @ViewChild('addModal', {static: false}) addModal;
  form: FormGroup;
  fieldGrid;
  gridParams;
  selectedRowData: ManageFaqModel;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'supplier', editable: true},
      {headerName: 'Câu hỏi', headerTooltip: 'Câu hỏi', field: 'question', editable: true},
      {headerName: 'Trả lời', headerTooltip: 'Trả lời', field: 'answer', editable: true},
      {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status', editable: true},
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

  onAdd() {
    this.addModal.open();
  }

  onEdit() {
    this.selectedRowData
      ? this.addModal.open(this.selectedRowData)
      : this.swalAlert.openWarningToast('Hãy chọn một dòng để cập nhật', 'Thông báo!');
  }

  search() {
    this.gridParams.api.updateRowData({add: [{}]});
  }

  onDel() {
    this.selectedRowData
      ? this.confirm.openConfirmModal('Xác nhận?', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        this.gridParams.api.updateRowData({remove: [this.selectedRowData]});
      })
      : this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa', 'Thông báo!');
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      supplier: [undefined],
    });
  }
}
