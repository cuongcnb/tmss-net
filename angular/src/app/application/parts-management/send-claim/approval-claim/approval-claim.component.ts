import { Component, OnInit, ViewChild, Injector} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgSelectRendererComponent } from '../../../../shared/ag-select-renderer/ag-select-renderer.component';
import { SendClaimApi } from '../../../../api/parts-management/send-claim.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { CurrentUserModel, PaginationParamsModel } from '../../../../core/models/base.model';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { ValidateBeforeSearchService } from '../../../../shared/common-service/validate-before-search.service';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { DealerModel } from '../../../../core/models/sales/dealer.model';
import { DealerApi } from '../../../../api/sales-api/dealer/dealer.api';
import {
  ApprovalClaimModel,
  PartsOfApprovalClaimModel,
} from '../../../../core/models/parts-management/approval-claim.model';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'approval-claim',
  templateUrl: './approval-claim.component.html',
  styleUrls: ['./approval-claim.component.scss'],
})
export class ApprovalClaimComponent extends AppComponentBase implements OnInit {
  @ViewChild('attachedFileModal', {static: false}) attachedFileModal;

  searchForm: FormGroup;
  claimForm: FormGroup;
  // currentUser: CurrentUserModel = CurrentUser;
  dealerList: DealerModel[];

  fieldClaim;
  claimParams;
  claimList: ApprovalClaimModel[];
  selectedClaim: ApprovalClaimModel;

  paginationTotalsData: number;
  paginationParams: PaginationParamsModel;

  fieldParts;
  partsParams;
  partsData: PartsOfApprovalClaimModel[];
  displayedParts: PartsOfApprovalClaimModel[];

  frameworkComponents;

  claimStatusOld;
  isHeaderChange;

  listPartsTemp = [];

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private sendClaimApi: SendClaimApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private validateBeforeSearchService: ValidateBeforeSearchService,
    private gridTableService: GridTableService,
    private dealerApi: DealerApi,
    private dataFormatService: DataFormatService,
  ) {
    super(injector);
    this.fieldClaim = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
        width: 80,
      },
      {
        headerName: 'Claim No',
        headerTooltip: 'Claim No',
        field: 'claimNo',
      },
    ];
    this.fieldParts = [
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'STT',
            headerTooltip: 'Số thứ tự',
            cellRenderer: params => params.rowIndex + 1,
          },
          {
            headerName: 'Mã PT',
            headerTooltip: 'Mã phụ tùng',
            field: 'partsCode',
          },
          {
            headerName: 'Tên PT',
            headerTooltip: 'Tên phụ tùng',
            valueGetter: params => {
               return params.data && params.data.partsNameVn && !!params.data.partsNameVn
                 ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
            },
          },
        ],
      },
      {
        headerName: 'Số lượng nhận',
        headerTooltip: 'Số lượng nhận',
        children: [
          {
            headerName: 'Trên HĐ',
            headerTooltip: 'Trên HĐ',
            field: 'qtyOrder',
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
          },
          {
            headerName: 'Thực',
            headerTooltip: 'Thực',
            field: 'qtyRecv',
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
          },
        ],
      },
      {
        headerName: 'Số lượng Claim',
        headerTooltip: 'Số lượng Claim',
        children: [
          {
            headerName: 'Sai',
            headerTooltip: 'Sai',
            field: 'sai',
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right'],
          },
          {
            headerName: 'Vỡ',
            headerTooltip: 'Vỡ',
            field: 'vo',
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right'],
          },
          {
            headerName: 'Hỏng',
            headerTooltip: 'Hỏng',
            field: 'hong',
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right'],
          },
          {
            headerName: 'Thiếu',
            headerTooltip: 'Thiếu',
            field: 'thieu',
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right'],
          },
        ],
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'Giá nhập',
            headerTooltip: 'Giá nhập',
            field: 'netprice',
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
          },
          {
            headerName: 'Thành tiền',
            headerTooltip: 'Thành tiền',
            field: 'sumPrice',
            tooltip: params => this.dataFormatService.moneyFormat(params.data.qtyRecv * params.data.netprice),
            cellRenderer: params => this.dataFormatService.moneyFormat(params.data.qtyRecv * params.data.netprice),
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
          },
          {
            headerName: 'Trạng thái 2',
            headerTooltip: 'Trạng thái 2',
            field: 'claimDStatus',
            cellRenderer: 'agSelectRendererComponent',
            cellClass: ['p-0'],
            editable: true,
            list: [
              { key: 1, value: 'Chưa giải quyết', },
              { key: 2, value: 'Đang giải quyết', },
              { key: 3, value: 'Chấp nhận', },
              { key: 4, value: 'từ chối', },
            ],
          },
          {
            headerName: 'Ghi chú',
            headerTooltip: 'Ghi chú',
            field: 'remarkDlr',
          },
        ],
      },
    ];
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent,
    };
    this.isHeaderChange = false;
  }

  ngOnInit() {
    this.buildForm();
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers().subscribe(res => {
      this.loadingService.setDisplay(false);
      this.dealerList = res;
      const currentDlr = this.dealerList.find(dealer => dealer.id === this.currentUser.dealerId);
      this.currentUser.dealerCode = currentDlr.code;
    });
  }

  // =====***** CLAIM GRID *****=====
  callbackClaim(params) {
    this.claimParams = params;
    this.search();
  }

  getParamsClaim() {
    const selectedClaim = this.claimParams.api.getSelectedRows();
    if (selectedClaim) {
      this.selectedClaim = selectedClaim[0];
      this.claimForm.patchValue(this.selectedClaim);
      this.claimStatusOld = this.selectedClaim.claimStatus;
      this.searchParts();
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.claimList) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  search() {
    this.loadingService.setDisplay(true);
    this.sendClaimApi.searchApprovalClaim(this.searchForm.value, this.paginationParams).subscribe(res => {
      this.loadingService.setDisplay(false);
      const key = Object.keys(res)[0];
      this.claimList = res[key];
      this.paginationTotalsData = +key;
      this.claimParams.api.setRowData(this.claimList);
      if (this.claimList.length) {
        this.gridTableService.autoSelectRow(this.claimParams, this.claimList, this.selectedClaim, 'claimId');
      } else {
        this.partsData = [];
        this.partsParams.api.setRowData(this.partsData);
      }
    });
  }

  // =====***** PARTS OF CLAIM GRID *****=====
  callBackParts(params) {
    this.partsParams = params;
  }

  getParamsParts() {
  }

  searchParts() {
    this.loadingService.setDisplay(true);
    this.sendClaimApi.searchPartsOfApprovalClaim(this.selectedClaim.claimId).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.partsData = res;
      this.partsParams.api.setRowData(this.partsData);
      this.getDisplayedData();
    });
  }

  cellEditingStopped() {
    this.getDisplayedData();
  }

  // SAVE CLAIM
  saveClaim() {
    const data = Object.assign({}, {
      approvalSendingClaimHeaderDTO: this.claimForm.getRawValue(),
      approvalSendingClaimDetailDTOs: this.displayedParts,
    });
    this.loadingService.setDisplay(true);
    this.sendClaimApi.saveClaimTmv(data).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.claimStatusOld = this.claimForm.value.claimStatus;
      this.isHeaderChange = false;
      if (this.isHeaderChange) {
        this.listPartsTemp = this.displayedParts;
        this.listPartsTemp.forEach(part => {
          part.claimDStatus = this.claimForm.value.claimStatus;
        });
        this.partsParams.api.setRowData(this.listPartsTemp);
      }
    });
  }

  getDisplayedData() {
    this.displayedParts = this.gridTableService.getAllData(this.partsParams);
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.searchForm = this.formBuilder.group({
      dlrId: [undefined],
      claimDate: [undefined],
      claimNo: [undefined],
      statusHeader: [undefined],
      partsCode: [undefined],
      fromDate: [new Date(year, month, date - 7)],
      toDate: [new Date(year, month, date, 23, 59, 59)],
      sVourcher: [undefined],
      statusDetail: [undefined],
    });
    this.claimForm = this.formBuilder.group({
      dlrCode: [{value: undefined, disabled: true}],
      claimStatus: [undefined],
      claimDate: [{value: undefined, disabled: true}],
      sVoucher: [{value: undefined, disabled: true}],
      invoiceNo: [{value: undefined, disabled: true}],
      shipDate: [{value: undefined, disabled: true}],
      dlrRemark: [{value: undefined, disabled: true}],
      tmvRemark: [undefined],

      // Hidden fields, taken from selectedClaim
      claimNo: [undefined],
      claimId: [undefined],
      createdBy: [undefined],
      createdDate: [undefined],
      dlrId: [undefined],
      modifiedBy: [undefined],
      modifiedDate: [undefined],
      orderId: [undefined],
      orderNo: [undefined],
      partsRecvId: [undefined],
      prStatus: [undefined],
      region: [undefined],
    });
  }

  checkHeaderChange() {
    const value = this.claimForm.value.claimStatus;
    if (this.claimStatusOld === value) {
      this.isHeaderChange = false;
    } else {
      this.isHeaderChange = true;
    }
  }
}
