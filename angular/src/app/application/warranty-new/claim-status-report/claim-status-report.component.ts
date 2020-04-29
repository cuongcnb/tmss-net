import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import * as moment from 'moment';

import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {CurrentUser} from '../../../home/home.component';
import {ClaimStatusReportApi} from '../../../api/warranty/claim-status-report.api';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ClaimStatusReportModel} from '../../../core/models/warranty/claim-status-report.model';
import {User} from '../../../core/constains/user';
import {Waranty} from '../../../core/constains/waranty';
import {SubletApi} from '../../../api/common-api/sublet.api';

// import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'claim-status-report',
  templateUrl: './claim-status-report.component.html',
  styleUrls: ['./claim-status-report.component.scss'],
})
export class ClaimStatusReportComponent implements OnInit {
  @ViewChild('searchRoModal', {static: false}) searchRoModal;
  @ViewChild('claimDetailModal', {static: false}) claimDetailModal;
  @ViewChild('claimDetailViewModal', {static: false}) claimDetailViewModal;

  searchForm;
  selectedClaimStatus;
  claimStatusParams;
  claimStatusList: ClaimStatusReportModel[] = [];
  paginationParams;
  paginationTotalsData;
  totalClaimAmount;
  totalAdjustAmount;
  sourceTable;
  state;
  fieldClaimStatusList;
  currentUser = CurrentUser;
  dealers = [];
  brands;
  dataIdList;
  wtList;
  stateList;
  isTMV = false;
  subletTypeList: Array<any>;

  constructor(
    private formBuilder: FormBuilder,
    private dealerApi: DealerApi,
    private claimStatusReportApi: ClaimStatusReportApi,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private subletApi: SubletApi,
    // private gridTableService: GridTableService
  ) {
    this.fieldClaimStatusList = [
      {
        headerName: 'No.',
        headerTooltip: 'No.',
        pinned: true,
        resizable: true,
        cellRenderer: params => params.rowIndex + 1,
      },
      {
        headerName: 'Claim No.',
        headerTooltip: 'Claim No.',
        pinned: true,
        field: 'dealerClaimNo',
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        resizable: true,
      },
      {
        headerName: 'Brand',
        headerTooltip: 'Brand',
        resizable: true,
        pinned: true,
        field: 'brand',
      },
      {
        headerName: 'WT',
        headerTooltip: 'WT',
        pinned: true,
        resizable: true,
        field: 'warrantyType',
      },
      {
        headerName: 'Submit Date',
        headerTooltip: 'Submit Date',
        resizable: true,
        pinned: true,
        field: 'submitDate',
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Claim Amount',
        headerTooltip: 'Claim Amount',
        resizable: true,
        pinned: true,
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        field: 'claimAmount',
      },
      {
        headerName: 'Adjustment Amount',
        headerTooltip: 'Adjustment Amount',
        resizable: true,
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        pinned: true,
        field: 'adjustAmount',
      },
      {
        headerName: 'Reason Code',
        headerTooltip: 'Reason Code',
        resizable: true,
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        pinned: true,
        field: 'reasonCode',
      },
      {
        headerName: 'State',
        headerTooltip: 'State',
        resizable: true,
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        pinned: true,
        field: 'state.stateTitle',
        colId: 'state',
      },
      {
        headerName: 'State TMV',
        headerTooltip: 'State TMV',
        resizable: true,
        pinned: true,
        field: 'tmvState.stateTitle',
        colId: 'tmvStatus',
      },
      {
        headerName: 'E-code 1',
        headerTooltip: 'E-code 1',
        resizable: true,
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        field: 'errorCode1',
      },
      {
        headerName: 'E-code 2',
        headerTooltip: 'E-code 2',
        resizable: true,
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        field: 'errorCode2',
      },
      {
        headerName: 'E-code 3',
        headerTooltip: 'E-code 3',
        resizable: true,
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        field: 'errorCode3',
      },
      {
        headerName: 'E-code 4',
        headerTooltip: 'E-code 4',
        resizable: true,
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        field: 'errorCode5',
      },
      {
        headerName: 'E-code 5',
        resizable: true,
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        field: 'errorCode5',
      },
      {
        headerName: 'DLR-Stuff',
        headerTooltip: 'DLR-Stuff',
        resizable: true,
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        field: 'dlrStaffName',
      },
      {
        headerName: 'DIST-Stuff',
        headerTooltip: 'DIST-Stuff',
        resizable: true,
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        field: 'distStaffName',
      },
      {
        headerName: 'DISTM-Stuff ',
        headerTooltip: 'DISTM-Stuff ',
        resizable: true,
        field: 'distManagerName',
      },
      {
        headerName: 'DIST-Comment',
        headerTooltip: 'DIST-Comment',
        resizable: true,
        field: 'distComment',
      },
      {
        headerName: 'DLR-Comment',
        headerTooltip: 'DLR-Comment',
        resizable: true,
        field: 'dlrComment',
      },
    ];
    this.brands = [
      { key: '', value: '', },
      { key: 1, value: 'TOYOTA', },
      { key: 4, value: 'LEXUS', },
    ];
    this.dataIdList = [
      { key: '', value: '', },
      { key: 'W', value: 'Warranty', },
      { key: 'P', value: 'Warranty PAC', },
      { key: 'S', value: 'SETR', },
      { key: 'F', value: 'FreePM', },
    ];
    this.wtList = [{ key: 'VE', value: 'VE', }, ];
  }

  ngOnInit() {
    this.subletApi.getAll().subscribe(val => {
      if (val) {
        this.subletTypeList = val;
      }
    });
    this.isTMV = this.currentUser.dealerId === User.tmvDealerId;
    this.dealerApi.getAllAvailableDealers().subscribe(val => {
      if (val) {
        this.dealers = val;
        // this.dealers.unshift(Waranty.allDealer);
      }
    });
    this.buildForm();
    if (this.isTMV) {
      this.searchStatus('tmv-dlr');
    } else {
      this.searchStatus('dlr');
    }
  }

  searchStatus(val) {
    this.claimStatusReportApi.getStatusAll(val).subscribe(resp => {
      if (resp) {
        this.stateList = resp;
      }
    });
  }

  callbackClaimStatus(params) {
    this.claimStatusParams = params;
    this.claimStatusParams.columnApi.setColumnVisible('tmvStatus', this.sourceTable === 'STWC');
    this.claimStatusParams.columnApi.setColumnVisible('status', this.sourceTable === 'TWC');
    this.searchClaim();
  }

  getParamsClaimStatus() {
    const selectedClaimStatus = this.claimStatusParams.api.getSelectedRows();
    if (selectedClaimStatus) {
      this.selectedClaimStatus = selectedClaimStatus[0];
      if (this.selectedClaimStatus.state) {
        this.state = this.selectedClaimStatus.state.stateValue;
      }
      if (this.selectedClaimStatus.tmvState) {
        this.state = this.selectedClaimStatus.tmvState.stateValue;
      }
    }
  }

  editClaim() {
    if (!this.isTMV) {
      this.sourceTable = 'TWC';
    }
    if (!this.selectedClaimStatus) {
      this.swalAlertService.openWarningToast('Chọn 1 yêu cầu để sửa', 'Bạn chưa chọn yêu cầu');
    } else {
      this.claimDetailModal.edit(this.selectedClaimStatus, this.sourceTable);
    }
  }

  adjustClaim() {
    if (!this.selectedClaimStatus) {
      this.swalAlertService.openWarningToast('Chọn 1 yêu cầu để điều chỉnh', 'Bạn chưa chọn yêu cầu');
    } else {
      this.claimDetailModal.adjustCheck(this.selectedClaimStatus, this.sourceTable);
    }
  }

  viewClaim() {

    if (!this.isTMV) {
      this.sourceTable = 'TWC';
    }

    if (!this.selectedClaimStatus) {
      this.swalAlertService.openWarningToast('Chọn 1 yêu cầu để xem', 'Bạn chưa chọn yêu cầu');
    } else {
      this.claimDetailViewModal.open(this.subletTypeList, this.selectedClaimStatus, this.sourceTable);
    }
  }

  searchClaim() {
    const formValue = this.searchForm.getRawValue();
    const errorMsg = [];
    if (formValue.dateFrom && formValue.dateTo && formValue.dateFrom > formValue.dateTo) {
      errorMsg.push('Ngày DLR Submit: Ngày bắt đầu không thể lớn hơn ngày kết thúc');
      // this.swalAlertService.openWarningToast('Ngày bắt đầu không thể lớn hơn ngày kết thúc')
    }
    if (formValue.processDateFrom && formValue.processDateTo && formValue.processDateFrom > formValue.processDateTo) {
      errorMsg.push('Ngày TMV Submit: Ngày bắt đầu không thể lớn hơn ngày kết thúc');
      // this.swalAlertService.openWarningToast('Ngày bắt đầu không thể lớn hơn ngày kết thúc')
    }
    if (formValue.sTwcProcessDateFrom && formValue.sTwcProcessDateTo && formValue.sTwcProcessDateFrom > formValue.sTwcProcessDateTo) {
      errorMsg.push('Ngày Vender Submit: Ngày bắt đầu không thể lớn hơn ngày kết thúc');
      // this.swalAlertService.openWarningToast('Ngày bắt đầu không thể lớn hơn ngày kết thúc')
    }
    if (errorMsg.length) {
      this.swalAlertService.openFailToast(errorMsg.toString().replace(/,/g, ' <br> '), 'Lỗi ngày tìm kiếm');
      return;
    }
    this.resetPaginationParams();
    this.search();
  }

  search() {
    this.selectedClaimStatus = undefined;
    this.loadingService.setDisplay(true);
    this.claimStatusReportApi.search(this.searchForm.getRawValue(), this.paginationParams)
      .subscribe((val: { sourceTable: number, amount: number, adjustAmount: number, totalRecord: number,
        warrantySummaryLineTableDTOs: ClaimStatusReportModel[]
      }) => {
        // this.dataList.subscribe((val: { amount: number, adjustAmount: number, total: number, warrantySummaryLineTableDTOs: any }) => {
        if (val) {
          this.sourceTable = val.sourceTable;
          this.claimStatusParams.columnApi.setColumnVisible('tmvStatus', this.sourceTable === 'STWC');
          this.claimStatusParams.columnApi.setColumnVisible('status', this.sourceTable === 'TWC');
          this.totalClaimAmount = val.amount;
          this.totalAdjustAmount = val.adjustAmount;
          this.paginationTotalsData = val.totalRecord;
          for (const item of val.warrantySummaryLineTableDTOs) {
            item.claimAmount = this.formatDisplay(item.claimAmount);
            item.adjustAmount = this.formatDisplay(item.adjustAmount);
          }
          this.claimStatusList = val.warrantySummaryLineTableDTOs;
          this.claimStatusParams.api.setRowData(this.claimStatusList);
          const allColumnIds = [];
          this.claimStatusParams.columnApi.getAllColumns().forEach((column) => allColumnIds.push(column.colId));
          setTimeout(() => {
            this.claimStatusParams.columnApi.autoSizeColumns(allColumnIds);
          });
        }
        this.loadingService.setDisplay(false);
      });
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  changePaginationParams(paginationParams) {
    if (!this.claimStatusList) { return; }
    this.paginationParams = paginationParams;
    this.search();
  }

  clear() {
    this.searchForm.patchValue({
      dateFrom: null,
      dateTo: null,
      brand: null,
      dataId: null,
      opeM: null,
      ofpNo: null,
      processDateFrom: null,
      processDateTo: null,
      sTwcProcessDateFrom: null,
      sTwcProcessDateTo: null,
      dealerCode: null,
      dealerClaimNo: null,
    });
  }

  createClaim() {
    if (this.isTMV) {
      this.claimDetailModal.add(this.sourceTable);
    } else {
      this.searchRoModal.open(this.sourceTable);
    }
  }

  download() {
    // this.gridTableService.export(this.claimStatusParams, 'export', 'export');
    const paramsExport = {
      fileName: 'Claim-Status-Report',
      sheetName: 'export',
      columnGroups: true,
      allColumns: true,
      processCellCallback: (params) => {
        if (params.column.colDef.headerName === 'No.') {
          return `${params.node.rowIndex + 1}`;
        }
        // if (params.column.colDef.headerName === 'Submit Date') {
        if (params.column.colDef.field === 'submitDate') {
          return `${moment(params.value).format('DD/MM/YYYY')}`;
        }
        return params.value;
      },
    };
    this.claimStatusParams.api.exportDataAsExcel(paramsExport);
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      dlrId: [{ value: undefined, disabled: !this.isTMV }],
      dateFrom: [undefined],
      dateTo: [undefined],
      brand: [undefined],
      wt: [{ value: undefined, disabled: true }],
      dataId: [undefined],
      opeM: [undefined],
      ofpNo: [undefined],
      processDateFrom: [undefined],
      processDateTo: [undefined],
      sTwcProcessDateFrom: [undefined],
      sTwcProcessDateTo: [undefined],
      sourceTable: [undefined],
      state: [undefined],
      stateType: [undefined],
      claimFlag: [undefined],
      dealerCode: [{ value: undefined, disabled: !this.isTMV }],
      dealerClaimNo: [{ value: undefined, disabled: !this.isTMV }],
    });
    if (this.isTMV) {
      this.searchForm.patchValue({
        // dlrId: Waranty.allDealer.id
        dlrId: this.currentUser.dealerId
      });
    } else {
      this.searchForm.patchValue({
        dlrId: this.currentUser.dealerId,
      });
    }
    this.searchForm.get('sourceTable').valueChanges.subscribe(val => {
      this.sourceTable = val;
      let type = 'tmv-dlr';
      if (val === 'TWC') {
        this.searchForm.get('dateFrom').enable();
        this.searchForm.get('dateTo').enable();
        this.searchForm.get('processDateFrom').enable();
        this.searchForm.get('processDateTo').enable();
        this.searchForm.get('sTwcProcessDateFrom').disable();
        this.searchForm.get('sTwcProcessDateTo').disable();
        this.searchForm.patchValue({
          dateFrom: null,
          dateTo: null,
          processDateFrom: null,
          processDateTo: null,
          sTwcProcessDateFrom: null,
          sTwcProcessDateTo: null,
        });
      }
      if (val === 'STWC') {
        type = 'tmv-tmap';
        this.searchForm.get('dateFrom').disable();
        this.searchForm.get('dateTo').disable();
        this.searchForm.get('processDateFrom').disable();
        this.searchForm.get('processDateTo').disable();
        this.searchForm.get('sTwcProcessDateFrom').enable();
        this.searchForm.get('sTwcProcessDateTo').enable();
        this.searchForm.get('state').enable();
        this.searchForm.patchValue({
          dateFrom: null,
          dateTo: null,
          processDateFrom: null,
          processDateTo: null,
          sTwcProcessDateFrom: null,
          sTwcProcessDateTo: null,
          state: null,
        });
      }
      this.searchStatus(type);
    });

    if (this.isTMV) {
      this.searchForm.patchValue({
        wt: 'VE',
        sourceTable: 'TWC',
      });
    } else {
      this.searchForm.patchValue({
        wt: 'VE',
        sourceTable: 'DLR',
      });
    }
  }
  formatDisplay(val) {
    if (val) {
      return val.toLocaleString();
    }
  }
}
