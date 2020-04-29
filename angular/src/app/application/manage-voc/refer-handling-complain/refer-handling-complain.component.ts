import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { ReferHandlingComplainModel } from '../../../core/models/manage-voc/refer-handling-complain.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'refer-handling-complain',
  templateUrl: './refer-handling-complain.component.html',
  styleUrls: ['./refer-handling-complain.component.scss'],
})
export class ReferHandlingComplainComponent implements OnInit {

  form: FormGroup;
  fieldGrid;
  gridParams;
  selectedRowData: ReferHandlingComplainModel;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {headerName: 'Khiếu nại', headerTooltip: 'Khiếu nại', field: 'complain', editable: true},
      {headerName: 'Đại lý xử lý', headerTooltip: 'Đại lý xử lý', field: 'supplierReception', editable: true},
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

  onDelRow() {
    (!this.selectedRowData)
      ? this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa', 'Thông báo!')
      : this.confirm.openConfirmModal('Question?', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        this.gridParams.api.updateRowData({remove: [this.selectedRowData]});
      });
  }

  search() {
    this.gridParams.api.updateRowData({add: [{}]});
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      supplierReception: [undefined],
      dateSupplierReception: [undefined],
      todateSupplierReception: [undefined],
      complainField: [undefined],
      dateComplainReception: [undefined],
      todateComplainReception: [undefined],
      complainProblem: [undefined],
      complain: [undefined],
    });
  }
}
