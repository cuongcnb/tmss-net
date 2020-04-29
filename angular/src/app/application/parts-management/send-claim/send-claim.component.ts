import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SendClaimApi} from '../../../api/parts-management/send-claim.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {PaginationParamsModel} from '../../../core/models/base.model';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {ValidateBeforeSearchService} from '../../../shared/common-service/validate-before-search.service';
import {PartsOfSendClaimModel, SendClaimModel} from '../../../core/models/parts-management/send-claim.model';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {FileUploader, FileUploaderOptions} from 'ng2-file-upload';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'send-claim',
  templateUrl: './send-claim.component.html',
  styleUrls: ['./send-claim.component.scss']
})
export class SendClaimComponent implements OnInit {
  @ViewChild('approvalClaimModal', {static: false}) approvalClaimModal;
  @ViewChild('attachedFileModal', {static: false}) attachedFileModal;
  @ViewChild('sendClaimModal', {static: false}) sendClaimModal; 
  searchForm: FormGroup;
  invoiceForm: FormGroup;
  listFile;

  fieldInvoice;
  invoiceParams;
  invoiceData: SendClaimModel[] = [];
  selectedInvoice: SendClaimModel;

  paginationTotalsInvoice: number;
  invoicePaginationParams: PaginationParamsModel;

  fieldParts;
  partsParams;
  partsData: PartsOfSendClaimModel[] = [];
  displayedParts: PartsOfSendClaimModel[] = [];
  selectedPart: PartsOfSendClaimModel;

  currentRowParams;
  disableAttachBtn: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private sendClaimApi: SendClaimApi,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private gridTableService: GridTableService,
    private validateBeforeSearchService: ValidateBeforeSearchService,
    private swalAlertService: ToastService
  ) {
  }

  ngOnInit() {
    this.fieldInvoice = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
        field: 'stt',
        width: 50
      },
      {
        headerName: 'Số phiếu nhận hàng',
        headerTooltip: 'Số phiếu nhận hàng',
        field: 'sVoucher'
      }
    ];
    this.fieldParts = [
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'STT',
            headerTooltip: 'Số thứ tự',
            cellRenderer: (params) => params.rowIndex + 1,
            field: 'stt',
            width: 80
          },
          {
            headerName: 'Mã PT',
            headerTooltip: 'Mã phụ tùng',
            field: 'partsCode',
            width: 300
          },
          {
            headerName: 'Tên PT',
            headerTooltip: 'Tên phụ tùng',
            valueGetter: params => {
               return params.data && params.data.partsNameVn && !!params.data.partsNameVn
                 ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
            },
            width: 500
          }
        ]
      },
      {
        headerName: 'Số lượng nhận',
        headerTooltip: 'Số lượng nhận',
        children: [
          {
            headerName: 'Trên HĐ',
            headerTooltip: 'Trên hợp đồng',
            field: 'qtyOrder',
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
          },
          {
            headerName: 'Thực',
            headerTooltip: 'Thực',
            field: 'qtyRecv',
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
          }
        ]
      },
      {
        headerName: 'Số lượng Claim',
        headerTooltip: 'Số lượng Claim',
        children: [
          {
            headerName: 'Sai',
            headerTooltip: 'Sai',
            field: 'sai',
            editable: true,
            validators: ['floatPositiveNum'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Vỡ',
            headerTooltip: 'Vỡ',
            field: 'vo',
            editable: true,
            validators: ['floatPositiveNum'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Hỏng',
            headerTooltip: 'Hỏng',
            field: 'hong',
            editable: true,
            validators: ['floatPositiveNum'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Thiếu',
            headerTooltip: 'Thiếu',
            field: 'thieu',
            editable: true,
            validators: ['floatPositiveNum'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right']
          }
        ]
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
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
          },
          {
            headerName: 'Thành tiền',
            headerTooltip: 'Thành tiền',
            field: 'sumPrice',
            tooltip: params => this.dataFormatService.moneyFormat(params.data.qtyRecv * params.data.netprice),
            cellRenderer: params => this.dataFormatService.moneyFormat(params.data.qtyRecv * params.data.netprice),
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
          },
          {
            headerName: 'Ghi chú',
            headerTooltip: 'Ghi chú',
            field: 'remarkDlr',
            editable: true,
            cellClass: 'cell-border'
          }
        ]
      }
    ];
    this.buildForm();
    this.disableAttachBtn = true;
  }

  // =====***** INVOICE GRID TABLE *****=====
  callbackInvoice(params) {
    this.invoiceParams = params;
    this.search();
  }

  getParamsInvoice() {
    const selectedInvoice = this.invoiceParams.api.getSelectedRows();
    if (selectedInvoice) {
      this.selectedInvoice = selectedInvoice[0];
      this.invoiceForm.patchValue(this.selectedInvoice);
      this.searchParts();
      this.getTotalQtyBroken();
    }
  }

  changePaginationParamsInvoice(paginationParams) {
    if (!this.invoiceData) {
      return;
    }
    this.invoicePaginationParams = paginationParams;
    this.search();
  }

  search() {
    if (!this.validateBeforeSearchService.validSearchDateRange(this.searchForm.value.fromDate, this.searchForm.value.toDate)) {
      return;
    }
    let formValue = Object.assign({}, this.searchForm.value);
    formValue.claimStatus = this.searchForm.value.claimStatus ? 'Y' : 'N';
    formValue = this.validateBeforeSearchService.setBlankFieldsToNull(formValue);

    this.loadingService.setDisplay(true);
    this.sendClaimApi.searchClaim(formValue, this.invoicePaginationParams).subscribe(res => {
      this.loadingService.setDisplay(false);
      const key = Object.keys(res)[0];
      this.paginationTotalsInvoice = +key;
      this.invoiceData = res[key];
      this.invoiceParams.api.setRowData(this.invoiceData);

      // Check if claim data is blank
      if (this.invoiceData.length) {
        this.gridTableService.autoSelectRow(this.invoiceParams, this.invoiceData, this.selectedInvoice, 'partsRecvId');
      } else {
        this.partsData = [];
        this.partsParams.api.setRowData(this.partsData);
      }
    });
  }

  // =====***** PARTS GRID TABLE *****=====
  callBackParts(params) {
    this.partsParams = params;
  }

  getParamsParts() {
    const selectedPart = this.partsParams.api.getSelectedRows();
    if (selectedPart) {
      this.selectedPart = selectedPart[selectedPart.length - 1];
    }
  }

  searchParts() {
    this.loadingService.setDisplay(true);
    this.sendClaimApi.searchPartsOfClaim(this.selectedInvoice.partsRecvId, this.selectedInvoice.claimId).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.partsData = res;
      this.partsParams.api.setRowData(this.partsData);
      this.gridTableService.autoSizeColumn(this.partsParams);
      this.getDisplayedParts();
    });
  }

  getTotalQtyBroken() {
    this.invoiceForm.patchValue({
      wrongQty: undefined,
      brokenQty: undefined,
      failQty: undefined,
      lackQty: undefined
    });
    this.loadingService.setDisplay(true);
    this.sendClaimApi.getTotalQtyBroken(this.selectedInvoice.partsRecvId).subscribe(res => {
      this.invoiceForm.patchValue({
        wrongQty: res ? res.sai : undefined,
        brokenQty: res ? res.vo : undefined,
        failQty: res ? res.hong : undefined,
        lackQty: res ? res.thieu : undefined
      });
      this.loadingService.setDisplay(false);
    });
  }

  cellEditingStarted(params) {
    this.currentRowParams = params;
  }

  cellEditingStopped(params) {
    const claimQty = +params.data.sai + +params.data.vo + +params.data.hong;
    params.data.sumPrice = params.data.netprice * claimQty;
    this.selectedPart = params.data;
    this.getDisplayedParts();
  }

  agKeyUp(event) {
    event.stopPropagation();
    event.preventDefault();
    const keyCode = event.key;
    const editCell = this.partsParams.api.getEditingCells();
    const editableFields = ['sai', 'vo', 'hong', 'thieu', 'remarkDlr'];

    const KEY_TAB = 'Tab';

    const claimQty = +this.currentRowParams.data.sai + +this.currentRowParams.data.vo + +this.currentRowParams.data.hong;

    // if (srcElement.classList.contains('partsCode') && keyCode === KEY_ENTER) {
    //   this.searchPartInfo({ partsCode: srcElement.innerHTML });
    // }

    if (editCell && editCell.length) {
      if (
        keyCode === KEY_TAB // 9: tab, 13: enter
        && editableFields.indexOf(editCell[0].column.colId) > -1
        && claimQty > this.currentRowParams.data.qtyRecv
      ) {
        this.partsParams.api.tabToPreviousCell();
        this.swalAlertService.openWarningToast('Số lượng phụ tùng Claim không được vượt quá số lượng phụ tùng thực nhận');

        this.gridTableService.startEditCell(this.currentRowParams);
      }
    }
  }

  validClaimQty(params): boolean | number {
    const claimQty = +params.data.sai + +params.data.vo + +params.data.hong;
    if (claimQty > params.data.qtyRecv) {
      this.swalAlertService.openWarningToast('Số lượng phụ tùng Claim không được vượt quá số lượng phụ tùng thực nhận');

      this.gridTableService.startEditCell(params);
      return true;
    } else {
      params.data.sumPrice = params.data.netprice * claimQty;
      return false;
    }
  }

  // =====***** SAVE AND SEND CLAIM *****=====
  saveClaim() {
    if (this.disableSaveClaimBtn) {
      return;
    }
    if (this.checkBeforeSave() != 1) { // 1: cho phép gửi, 0: số lượng gửi vượt quá thực nhận, -1: số lượng trong kho không đủ
      if (this.checkBeforeSave() == 0) {
        this.swalAlertService.openWarningToast('Số lượng phụ tùng Claim gửi không được vượt quá số lượng phụ tùng thực nhận');
        return;
      } else if (this.checkBeforeSave() == -1) {
        this.swalAlertService.openWarningToast('Số lượng phụ tùng tồn không đủ');
        return;
      }
    }
    this.loadingService.setDisplay(true);
    this.sendClaimApi.saveClaim(this.getDataForSaveAndSend()).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.disableAttachBtn = false;
      this.search();
    });
  }

  sendClaim() {
    if (this.disableSaveClaimBtn) {
      return;
    }
    this.loadingService.setDisplay(true);
    this.sendClaimApi.sendClaim(this.getDataForSaveAndSend()).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.search();
    });
  }

  // Get data for submit
  getDataForSaveAndSend(): object {
    return Object.assign({}, {
      sendingClaimDetailDTOs: this.displayedParts,
      sendingClaimHeaderDTO: this.invoiceForm.getRawValue(),
      sendingClaimAttachDTOs: this.listFile
    });
  }

  showApprovalCaimModal() {
    this.approvalClaimModal.open();
  }

  get disableSaveClaimBtn(): boolean {
    if (!this.selectedInvoice || !this.partsData.length) {
      return true;
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.displayedParts.length; i++) {
      const claimAmount = +this.displayedParts[i].sai + +this.displayedParts[i].vo
        + +this.displayedParts[i].hong;
      if (claimAmount && claimAmount <= this.displayedParts[i].qtyRecv) {
        return false;
      }
    }
    return true;
  }

  checkBeforeSave() {
    var claimTotalAmount = 0;
    var recvTotalAmount = 0;
    for (let i = 0; i < this.displayedParts.length; i++) {
      const claimAmount = +this.displayedParts[i].sai + +this.displayedParts[i].vo
        + +this.displayedParts[i].hong;
      claimTotalAmount += claimAmount;
      recvTotalAmount += this.displayedParts[i].qtyRecv;
      if (claimAmount && claimAmount > this.displayedParts[i].qtyRecv) {
        return 0; // so luong gui vuot qua so luong nhan
      }
      if (claimAmount && claimAmount > this.displayedParts[i].ton) {
        return -1; // so luong ton khong du
      }
    }
    claimTotalAmount += this.invoiceForm.get('brokenQty').value + this.invoiceForm.get('failQty').value + this.invoiceForm.get('wrongQty').value;
    if (claimTotalAmount != 0 && claimTotalAmount > recvTotalAmount) {
      return 0; // so luong gui vuot qua so luong nhan
    }
    return 1; // cho phep gui
  }

  getDisplayedParts() {
    this.displayedParts = this.gridTableService.getAllData(this.partsParams);
    for (let i = 0; i < this.displayedParts.length; i++) {
      if (!this.displayedParts[i].vo) {
        this.displayedParts[i].vo = 0;
      }
      if (!this.displayedParts[i].sai) {
        this.displayedParts[i].sai = 0;
      }
      if (!this.displayedParts[i].hong) {
        this.displayedParts[i].hong = 0;
      }
      if (!this.displayedParts[i].thieu) {
        this.displayedParts[i].thieu = 0;
      }
    }
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.searchForm = this.formBuilder.group({
      sVourcher: [undefined],
      partCode: [undefined],
      fromDate: [new Date(year, month, date - 7)],
      toDate: [new Date(year, month, date, 23, 59, 59)],
      claimStatus: [undefined]
    });

    this.invoiceForm = this.formBuilder.group({
      orderNo: [{value: undefined, disabled: true}],
      invoiceNo: [{value: undefined, disabled: true}],
      modifiedDate: [{value: undefined, disabled: true}],
      createdDate: [{value: undefined, disabled: true}],
      dlrRemark: [undefined],
      wrongQty: [{value: undefined, disabled: true}],
      failQty: [{value: undefined, disabled: true}],
      lackQty: [{value: undefined, disabled: true}],
      brokenQty: [{value: undefined, disabled: true}],

      // Hidden fields, taken from selectedInvoice
      sVoucher: [undefined],
      claimId: [undefined],
      claimNo: [undefined],
      claimStatus: [undefined],
      createdBy: [undefined],
      dlrCode: [undefined],
      dlrId: [undefined],
      modifiedBy: [undefined],
      orderId: [undefined],
      partsRecvId: [undefined],
      prStatus: [undefined],
      shipDate: [undefined]
    });
  }

  openModal() {
    this.sendClaimModal.open();
  }
}
