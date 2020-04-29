import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { SendClaimApi } from '../../../../api/parts-management/send-claim.api';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { SendClaimModel } from '../../../../core/models/parts-management/send-claim.model';
import { ToastService } from '../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'send-claim-modal',
  templateUrl: './send-claim-modal.component.html',
  styleUrls: ['./send-claim-modal.component.scss'],
})
export class SendClaimModalComponent implements OnInit, OnChanges {
  @ViewChild('sendClaimModal', { static: false }) modal: ModalDirective;
  @Input() listFile;
  @Input() partsRecvId;
  @Input() orderNo;
  @Input() invoiceNo;
  @Input() selectedInvoice;
  @Output() search = new EventEmitter();
  @Output() attachedFile = new EventEmitter();
  @Output() save = new EventEmitter();

  modalHeight;
  fieldClaims;
  claimParams;
  partsParams;
  fieldParts;
  claimInvoiceForm;
  disabledButton;
  displayedParts;
  // selectedInvoice: SendClaimModel;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private sendClaimApi: SendClaimApi,
    private dataFormatService: DataFormatService,
    private gridTableService: GridTableService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private toastrService: ToastService
  ) { }

  ngOnInit() {
    this.fieldClaims = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
        field: 'stt',
        width: 50
      },
      {
        headerName: 'Số claim',
        headerTooltip: 'Số claim',
        field: 'claimNo'
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
                ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
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
            validators: ['floatPositiveNum'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
          },
          {
            headerName: 'Vỡ',
            headerTooltip: 'Vỡ',
            field: 'vo',
            validators: ['floatPositiveNum'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
          },
          {
            headerName: 'Hỏng',
            headerTooltip: 'Hỏng',
            field: 'hong',
            validators: ['floatPositiveNum'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
          },
          {
            headerName: 'Thiếu',
            headerTooltip: 'Thiếu',
            field: 'thieu',
            validators: ['floatPositiveNum'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
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
            cellClass: ['cell-border', 'cell-readonly']
          }
        ]
      }
    ];
    this.disabledButton = true;
    this.builFrom();
  }

  ngOnChanges(changes: SimpleChanges) { }

  open() {
    this.modal.show();
    this.getAllClaims();
  }

  reset() {
    this.claimParams.api.setRowData([]);
    this.partsParams.api.setRowData([]);
    this.claimInvoiceForm.reset();
    this.disabledButton = true;
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResizeWithoutFooter();
  }

  callBackClaims(params) {
    this.claimParams = params;
  }

  callBackParts(params) {
    this.partsParams = params;
  }

  getParamsClaims() {
    const selectedClaim = this.claimParams.api.getSelectedRows();
    if (selectedClaim && selectedClaim.length > 0) {
      let obj = Object.assign({}, selectedClaim[0], {
        partsRecvId: this.partsRecvId,
        claimId: selectedClaim[0].id,
        claimDate: selectedClaim[0].claimDate,
        dlrRemark: selectedClaim[0].remarkDlr,
        orderNo: this.orderNo,
        invoiceNo: this.invoiceNo
      })
      this.claimInvoiceForm.patchValue(obj);
      this.getPartsInClaim(selectedClaim[0].id);
      this.disabledButton = selectedClaim[0].claimDate ? true : false;
      selectedClaim[0].claimDate ? this.claimInvoiceForm.get('dlrRemark').disable() : this.claimInvoiceForm.get('dlrRemark').enable();
    }
  }

  getAllClaims() {
    this.sendClaimApi.getAllClaimByPartsRecvId(this.partsRecvId).subscribe(async res => {
      await this.claimParams.api.setRowData(res);
      this.gridTableService.autoSizeColumn(this.claimParams);
      this.getParamsClaims();
      this.gridTableService.autoSelectRow(this.claimParams, res, this.selectedInvoice, 'claimNo');
    });
  }

  getPartsInClaim(claim_id) {
    this.loadingService.setDisplay(true);
    this.sendClaimApi.searchPartsOfClaim(this.partsRecvId, claim_id).subscribe(res => {
      this.loadingService.setDisplay(false);
      // this.partsParams = res;
      this.partsParams.api.setRowData(res);
      this.gridTableService.autoSizeColumn(this.partsParams);
      this.getDisplayedParts();
    });
  }

  private builFrom() {
    this.claimInvoiceForm = this.formBuilder.group({
      orderNo: [{ value: undefined, disabled: true }],
      invoiceNo: [{ value: undefined, disabled: true }],
      claimDate: [{ value: undefined, disabled: true }],
      dlrRemark: [{ value: undefined, disabled: true }],

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

  getDisplayedParts() {
    this.displayedParts = this.gridTableService.getAllData(this.partsParams);
  }

  sendClaim() {
    this.loadingService.setDisplay(true);
    this.sendClaimApi.sendClaim(this.getSentObject()).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.disabledButton = true;
    }, error => {}, 
    () => {
      this.getAllClaims();
      this.search.emit();
    });
  }

  openAttachedFileModal() {
    this.attachedFile.emit();
  }

  saveClaim() {
    this.loadingService.setDisplay(true);
    this.sendClaimApi.saveClaim(this.getSentObject()).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.search.emit();
    },() => {
      this.getAllClaims();
    });
  }

  getSentObject() : object {
    return Object.assign({}, {
      sendingClaimDetailDTOs: this.displayedParts,
      sendingClaimHeaderDTO: this.claimInvoiceForm.getRawValue(),
      sendingClaimAttachDTOs: this.listFile
    });
  }
  
  deleteClaim() {
    this.loadingService.setDisplay(true);
    this.sendClaimApi.deleteClaim(this.claimInvoiceForm.value.claimId).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.toastrService.openSuccessToast("Thành công");
      this.disabledButton = true;
    }, error => {}, 
    () => {
      this.claimInvoiceForm.reset();
      this.getAllClaims();
      this.search.emit();
    });
  }
}