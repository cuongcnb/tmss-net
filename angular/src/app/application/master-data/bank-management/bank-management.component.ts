import { Component, ViewChild } from '@angular/core';
import { BankManagementService} from '../../../api/master-data/bank-management.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bank-management',
  templateUrl: './bank-management.component.html',
  styleUrls: ['./bank-management.component.scss']
})
export class BankManagementComponent {
  @ViewChild('bankManagementModal', {static: false}) bankManagementModal;
  fieldGrid;
  bankParams;
  selectedBank;

  constructor(
    private bankService: BankManagementService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmService,
    private swalAlertService: ToastService,
  ) {
    this.fieldGrid = [
      {field: 'bankCode', minWidth: 100},
      {field: 'bankName', minWidth: 250},
      {
        field: 'status', minWidth: 60, cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {headerName: 'Bank Type', field: 'bankType', minWidth: 150},
      {field: 'ordering', minWidth: 60, cellClass: ['cell-border', 'text-right'], filter: 'agNumberColumnFilter'},
      {field: 'address', minWidth: 150, cellClass: ['cell-border', 'cell-wrap-text'], autoHeight: true, },
    ];
  }

  callbackGridBank(params) {
    this.loadingService.setDisplay(true);
    this.bankService.getBankTable().subscribe(banks => {
      params.api.setRowData(banks);
      this.loadingService.setDisplay(false);
    });
    this.bankParams = params;
  }

  refreshList() {
    this.selectedBank = undefined;
    this.loadingService.setDisplay(true);
    this.bankService.getBankTable().subscribe(banks => {
      this.bankParams.api.setRowData(banks);
      this.loadingService.setDisplay(false);
    });
  }

  getParamsBank() {
    const selectedBank = this.bankParams.api.getSelectedRows();
    if (selectedBank) {
      this.selectedBank = selectedBank[0];
    }
  }

  updateBank() {
    if (this.selectedBank) {
      this.bankManagementModal.open(this.selectedBank);
    } else {
      this.swalAlertService.openWarningForceSelectData();
    }
  }

  deleteBank() {
    this.confirmationService.openConfirmModal('Are you sure', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.bankService.deleteBank(this.selectedBank.id).subscribe(() => {
          this.refreshList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
