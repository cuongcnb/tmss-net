import { Component, ViewChild } from '@angular/core';

import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { BankApi } from '../../../api/common-api/bank.api';
import { BankModel } from '../../../core/models/common-models/bank-model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bank-management',
  templateUrl: './bank-management.component.html',
  styleUrls: ['./bank-management.component.scss']
})
export class BankManagementComponent {
  @ViewChild('bankModal', {static: false}) bankModal;
  fieldGrid;
  bankParams;
  selectedBank: BankModel;

  constructor(
    private bankCommonApi: BankApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmService: ConfirmService,
  ) {
    this.fieldGrid = [
      {headerName: 'Mã ngân hàng', headerTooltip: 'Mã ngân hàng', field: 'bankCode'},
      {headerName: 'Tên ngân hàng', headerTooltip: 'Tên ngân hàng', field: 'bankName'},
      {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'bankAdd'},
      {headerName: 'Điện thoại', headerTooltip: 'Điện thoại', field: 'tel', cellClass: ['cell-border', 'text-right']},
      {headerName: 'Fax', headerTooltip: 'Fax', field: 'fax', cellClass: ['cell-border', 'text-right']},
      {headerName: 'Email', headerTooltip: 'Email', field: 'email'},
    ];
  }

  callbackGridBank(params) {
    this.bankParams = params;
    this.getBanks();
  }

  refreshList() {
    this.selectedBank = undefined;
    this.getBanks();
  }

  getParamsBank() {
    const selectedBank = this.bankParams.api.getSelectedRows();
    if (selectedBank) {
      this.selectedBank = selectedBank[0];
    }
  }

  updateBank() {
    this.selectedBank
      ? this.bankModal.open(this.selectedBank)
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  deleteBank() {
    if (this.selectedBank) {
      this.confirmService.openConfirmModal('Bạn có muốn xóa bản ghi này?')
        .subscribe(() => {
          this.loadingService.setDisplay(true);
          this.bankCommonApi.remove(this.selectedBank.id).subscribe(() => {
            this.loadingService.setDisplay(false);
            this.refreshList();
            this.swalAlertService.openSuccessToast();
          });
        });
    } else {
      this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
    }
  }

  get btnDeleteState() {
    return this.selectedBank ? null : true;
  }

  private getBanks() {
    this.loadingService.setDisplay(true);
    this.bankCommonApi.getBanksByDealer().subscribe(banks => {
      this.bankParams.api.setRowData(banks);
      this.loadingService.setDisplay(false);
    });
  }
}
