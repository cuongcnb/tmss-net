import { Component, ViewChild } from '@angular/core';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DealerBalanceService} from '../../../api/tfs/dealer-balance.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dealers-balance',
  templateUrl: './dealers-balance.component.html',
  styleUrls: ['./dealers-balance.component.scss'],
})
export class DealersBalanceComponent {
  @ViewChild('dealerBalanceEditModal', {static: false}) dealerBalanceEditModal;
  dealerBalanceParam;
  fieldGrid;
  rowClassRules;
  selectedDealerBalance;
  amountNotApprove;
  remainAmountTfs;
  dealerBalanceData;
  changedRows = [];

  paginationParams;

  constructor(
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private dealerBalanceService: DealerBalanceService,
  ) {
    this.fieldGrid = [
      { field: 'code', resizable: true},
      {
        field: 'name',
        minWidth: 180,
        resizable: true
      },
      {
        field: 'amount',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
        minWidth: 160,
        resizable: true
      },
      {
        field: 'adjustment',
        cellClass: ['text-right', 'cell-clickable', 'cell-border'],
        filter: 'agNumberColumnFilter',
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
        minWidth: 160,
        resizable: true
      },
    ];
    this.rowClassRules = {
      'is-edited': (params) => {
        return this.changedRows.length > 0 && this.changedRows.find(item => item.id === params.data.id);
      },
    };
  }

  callbackGridDealerBalance(params) {
    this.dealerBalanceParam = params;
    this.refreshList();
  }

  getSelectedDealerBalance() {
    const selectedDealerBalances = this.dealerBalanceParam.api.getSelectedRows();
    if (selectedDealerBalances) {
      this.selectedDealerBalance = selectedDealerBalances[0];
      this.amountNotApprove = this.dataFormatService.numberFormat(this.selectedDealerBalance.amountNotApprove);
      this.remainAmountTfs = this.dataFormatService.numberFormat(this.selectedDealerBalance.remainAmountTfs);
    }
  }

  refreshList() {
    this.loadingService.setDisplay(true);
    this.dealerBalanceService.getAllDealerBalance().subscribe(dealerBalanceData => {
      this.changedRows = [];
      this.selectedDealerBalance = undefined;
      this.dealerBalanceData = dealerBalanceData;
      this.dealerBalanceParam.api.setRowData(this.dealerBalanceData);
      const allColumnIds = [];
      this.dealerBalanceParam.columnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));
      this.dealerBalanceParam.columnApi.autoSizeColumns(allColumnIds);
      this.loadingService.setDisplay(false);
    });
  }

  agCellDoubleClicked(params) {
    if (this.selectedDealerBalance && params.colDef.field === 'adjustment') {
      this.dealerBalanceEditModal.open(this.selectedDealerBalance);
    }
  }

  getChangedRows(changedRow) {
    if (this.changedRows.length < 1 || ! this.changedRows.find(row => row.id === changedRow.id)) {
      // First time
      this.changedRows.push(changedRow);
    } else if (this.changedRows.find(row => row.id === changedRow.id)) {
      const index = this.changedRows.indexOf(this.changedRows.find(row => row.id === changedRow.id));
      this.changedRows[index] = changedRow;
    }
  }

  setFilterModel(params) {
    if (this.paginationParams && this.paginationParams.filters.length) {
      const obj = {};
      this.paginationParams.filters.map(item => {
        obj[item.fieldFilter] = {
          type: 'contains',
          filterType: 'text',
          filter: item.filterValue,
        };
      });

      params.api.setFilterModel(obj);
    }
  }

  changePaginationParams(params) {
    this.paginationParams = params;
  }

  setDataToRow(dealerBalance) {
    this.getChangedRows(dealerBalance);
    const index = this.dealerBalanceData.indexOf(this.selectedDealerBalance);
    this.dealerBalanceData[index] = dealerBalance;
    this.dealerBalanceParam.api.setRowData(this.dealerBalanceData);
    this.setFilterModel(this.dealerBalanceParam);
  }

  save() {
    this.loadingService.setDisplay(true);
    this.dealerBalanceService.changeDealerBalanceAmount(this.changedRows).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.refreshList();
      this.swalAlertService.openSuccessModal('Save successful');
    });
  }
}
