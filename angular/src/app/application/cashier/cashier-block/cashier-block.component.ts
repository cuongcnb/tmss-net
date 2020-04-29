import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {CashierModel} from '../../../core/models/cashier/cashier.model';
import {LoadingService} from '../../../shared/loading/loading.service';
import {CashierApi} from '../../../api/dlr-cashier/cashier.api';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {PaginationParamsModel} from '../../../core/models/base.model';
import {InvCusApi} from '../../../api/dlr-cashier/inv-cus.api';
import {DownloadService} from '../../../shared/common-service/download.service';
import {ShortcutEventOutput, ShortcutInput} from 'ng-keyboard-shortcuts';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cashier-block',
  templateUrl: './cashier-block.component.html',
  styleUrls: ['./cashier-block.component.scss']
})
export class CashierBlockComponent implements OnInit, AfterViewInit {
  @ViewChild('cashierDetail', {static: false}) cashierDetail;
  @ViewChild('goOutGatePrinting', {static: false}) goOutGatePrinting;
  @Output() shortcuts = new EventEmitter<Array<ShortcutInput>>();
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;

  form: FormGroup;
  searchForm: FormGroup;
  gridField;
  gridParams;

  selectedCashier;
  cashiers: Array<CashierModel> = [];
  invoiceCusId: number;

  paginationParams: PaginationParamsModel;
  paginationTotalsData: number;
  keyboardShortcuts: Array<ShortcutInput> = [];

  constructor(
    private formBuilder: FormBuilder,
    private loading: LoadingService,
    private dataFormatService: DataFormatService,
    private cashierApi: CashierApi,
    private invCusApi: InvCusApi,
    private gridTable: GridTableService,
    private downloadService: DownloadService
  ) {
  }

  ngOnInit() {
    this.gridField = [
      {
        headerName: 'Ngày', headerTooltip: 'Ngày', field: 'dateClose',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'registerno'},
      {
        headerName: 'Tiền đã đặt', headerTooltip: 'Tiền đã đặt', field: 'moneyBooking',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.formatMoney(params.value),
        valueFormatter: params => this.dataFormatService.formatMoney(params.value)
      }
    ];
    this.buildForm();
    this.buildSearchForm();
    this.refreshInvoice();
  }

  ngAfterViewInit(): void {
    this.keyboardShortcuts = [
      {
        key: ['ctrl + p', 'ctrl + P'],
        label: 'Thu ngân',
        description: 'In hóa đơn',
        command: (e: ShortcutEventOutput) => this.invoiceCusId ? this.reportTypeModal.open(1) : {},
        preventDefault: true
      },
      {
        key: ['ctrl + g', 'ctrl + G'],
        label: 'Thu ngân',
        description: 'In giấy ra cổng',
        command: (e: ShortcutEventOutput) => this.invoiceCusId ? this.checkResidualRO() : {},
        preventDefault: true
      }
    ];
    this.shortcuts.emit(this.keyboardShortcuts);
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.refreshInvoice();
  }

  getParams() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.selectedCashier = selected[0];
      this.invoiceCusId = undefined;
      this.form.patchValue(Object.assign({},
        this.selectedCashier,
        {debttotal: this.dataFormatService.formatMoney(this.selectedCashier.debttotal)}));
      this.getLaborAndMaterialCost(this.selectedCashier.roId);
      this.cashierDetail.getInvoice(this.selectedCashier.id);
    }
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  changePaginationParams(paginationParams) {
    if (!this.cashiers) {
      return;
    }

    this.paginationParams = paginationParams;
    this.search();
  }

  refresh() {
    this.resetPaginationParams();
    this.search();
    this.selectedCashier = undefined;
  }

  refreshInvoice() {
    this.loading.setDisplay(true);
    this.cashierApi.refreshInvoice().subscribe(() => {
      this.loading.setDisplay(false);
      this.refresh();
    });
  }

  setInvoiceCusId(invoiceCusId) {
    this.invoiceCusId = invoiceCusId;
  }

  createInvoice() {
    const objRequest = Object.assign({}, {
      cashierId: this.selectedCashier.id,
      cusAdd: this.selectedCashier.cusadd,
      cusName: this.selectedCashier.cusname,
      roId: this.selectedCashier.roId,
      taxCode: this.selectedCashier.custaxno,
      custel: this.selectedCashier.custel
    });
    this.loading.setDisplay(true);
    this.invCusApi.createInvoice(objRequest).subscribe(() => {
      this.loading.setDisplay(false);
      this.cashierDetail.getInvoice(this.selectedCashier.id);
    }, err => {
      if (err.status) {
        this.cashierDetail.getInvoice(this.selectedCashier.id);
      }
    });
  }

  printInvoice(params) {
    this.loading.setDisplay(true);
    this.cashierApi.printInvoice(this.invoiceCusId, params.extension).subscribe(response => {
      this.loading.setDisplay(false);
      this.downloadService.downloadFile(response);
    });
  }

  printOutGate(appw) {
    const requestData = Object.assign({}, {
      appw,
      cashierId: this.selectedCashier.id,
      cusId: this.selectedCashier.cusId,
      reason: this.selectedCashier.reason,
      ro_id: this.selectedCashier.roId
    });
    this.loading.setDisplay(true);
    this.cashierApi.printOutGate(requestData).subscribe(response => {
      this.loading.setDisplay(false);
      if (response) {
        this.downloadService.downloadFile(response);
        this.refreshInvoice();
      }
      this.refresh();
    });
  }

  private getLaborAndMaterialCost(roId) {
    this.loading.setDisplay(true);
    this.cashierApi.getLaborAndMaterialCost(roId).subscribe(res => {
      if (res) {
        this.form.patchValue(Object.assign({}, {
          costMaterial: this.dataFormatService.formatMoney(res.costMaterial),
          costLabor: this.dataFormatService.formatMoney(res.costLabor)
        }));
      }
      this.loading.setDisplay(false);
    });
  }

  private search() {
    this.loading.setDisplay(true);
    this.cashierApi.search(this.searchForm.getRawValue(), this.paginationParams).subscribe(res => {
      if (res) {
        this.cashiers = res.list || [];
        this.paginationTotalsData = res.total;
      }
      this.loading.setDisplay(false);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [{value: undefined, disabled: true}],
      dlrno: [{value: undefined, disabled: true}],
      roNum: [{value: undefined, disabled: true}],
      cusId: [{value: undefined, disabled: true}],
      cusname: [{value: undefined, disabled: true}],
      custaxno: [{value: undefined, disabled: true}],
      cusadd: [{value: undefined, disabled: true}],
      reason: [{value: undefined, disabled: true}],
      costMaterial: [{value: undefined, disabled: true}],
      costLabor: [{value: undefined, disabled: true}],
      debttotal: [{value: undefined, disabled: true}]
    });
  }

  private buildSearchForm() {
    this.searchForm = this.formBuilder.group({
      fieldSort: [undefined],
      sortType: [{value: undefined, disabled: true}]
    });

    this.searchForm.get('fieldSort').valueChanges.subscribe(val => {
      if (val) {
        this.searchForm.get('sortType').setValue('asc');
        this.searchForm.get('sortType').enable();
      } else {
        this.searchForm.get('sortType').setValue(undefined);
        this.searchForm.get('sortType').disable();
      }
    });
    this.searchForm.get('sortType').valueChanges.subscribe(() => {
      this.refresh();
    });
  }

  checkResidualRO() {
    this.loading.setDisplay(true);
    this.cashierApi.checkResidualRO(this.selectedCashier.id).subscribe(() => {
      this.loading.setDisplay(false);
      this.printOutGate(0);
    }, err => {
      if (err.status === 7005) {
        this.goOutGatePrinting.open(this.selectedCashier.roId, this.selectedCashier.cusId);
      }
    });
  }

  patchDataToGrid(array) {
    if (array) {
      this.gridParams.api.setRowData(array);
      if (array.length) {
        this.gridTable.selectFirstRow(this.gridParams);
      }
    }
  }
}
