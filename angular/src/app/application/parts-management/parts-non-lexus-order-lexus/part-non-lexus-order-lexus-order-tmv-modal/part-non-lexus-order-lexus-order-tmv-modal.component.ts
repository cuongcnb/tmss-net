import {Component, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {CurrentUserModel} from '../../../../core/models/base.model';
import {CurrentUser} from '../../../../home/home.component';
import {
  DlrNonLexusOrderLexusOrderModel,
  DlrNonLexusOrderLexusPartModel
} from '../../../../core/models/parts-management/parts-non-lexus-order-lexus.model';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {PartsNonLexusOrderLexusApi} from '../../../../api/parts-management/parts-non-lexus-order-lexus.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-non-lexus-order-lexus-order-tmv-modal',
  templateUrl: './part-non-lexus-order-lexus-order-tmv-modal.component.html',
  styleUrls: ['./part-non-lexus-order-lexus-order-tmv-modal.component.scss']
})
export class PartNonLexusOrderLexusOrderTmvModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @Input() childDealerOfLexus: Array<{ abbreviation: string, dlrCode: string, id: number }> = [];
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  form: FormGroup;
  currentUser: CurrentUserModel = CurrentUser;

  fieldGridOrder;
  orderParams;
  selectedOrder: DlrNonLexusOrderLexusOrderModel;

  fieldGridPart;
  partParams;
  partsOfOrder: Array<DlrNonLexusOrderLexusPartModel> = [];

  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  constructor(
    private loadingService: LoadingService,
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private toastService: ToastService,
    private partsNonLexusOrderLexusApi: PartsNonLexusOrderLexusApi,
    private gridTableService: GridTableService
  ) {
  }

  ngOnInit() {
    this.fieldGridOrder = [
      {
        headerName: 'Mã ĐL',
        headerTooltip: 'Mã đại lý',
        field: 'dlrCodeDisplay'
      },
      {
        headerName: 'Số đơn hàng',
        headerTooltip: 'Số đơn hàng',
        field: 'orderNo'
      },
      {
        headerName: 'Số ĐH gửi TMV',
        headerTooltip: 'Số ĐH gửi TMV',
        field: 'tmvordNo'
      },
      {
        headerName: 'ĐL nhận',
        headerTooltip: 'ĐL nhận',
        field: 'receiveDlr'
      },
      {
        headerName: 'Đại lý Ghi chú',
        headerTooltip: 'Đại lý Ghi chú',
        field: 'dlrNote'
      },
      {
        headerName: 'Lexus Ghi chú',
        headerTooltip: 'Lexus Ghi chú',
        field: 'remarkTmv'
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'statusName'
      },
      {
        headerName: 'PTVC',
        headerTooltip: 'PTVC',
        field: 'transportType'
      },
      {
        headerName: 'Ngày tạo',
        headerTooltip: 'Ngày tạo',
        field: 'createDate',
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      }
    ];
    this.fieldGridPart = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 80,
        cellClass: ['text-center', 'cell-readonly', 'cell-border']
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode'
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit'
      },
      {
        headerName: 'SL',
        headerTooltip: 'Số lượng',
        field: 'qty',
        cellClass: ['text-right', 'cell-readonly', 'cell-border']
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'sumPrice',
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        cellClass: ['text-right', 'cell-readonly', 'cell-border']
      },
      {
        headerName: 'Tên xe',
        headerTooltip: 'Tên xe',
        field: 'car'
      },
      {
        field: 'modelCode'
      },
      {
        headerName: 'Số VIN',
        headerTooltip: 'Số VIN',
        field: 'vin'
      },
      {
        headerName: 'Mã CK',
        headerTooltip: 'Mã CK',
        field: 'keyCode'
      },
      {
        headerName: 'Số ghế',
        headerTooltip: 'Số ghế',
        field: 'seatNo'
      }
    ];
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedOrder, partsOfOrder) {
    this.selectedOrder = selectedOrder;
    this.partsOfOrder = this.calculateTMVPrice([...partsOfOrder]);
    this.modal.show();
    this.buildForm();
    this.patchValue();
  }

  calculateTMVPrice(partsOfOrder) {
    return partsOfOrder.map(part => ({...part, price: part.priceTMV, sumPrice: part.sumPriceTMV}));
  }

  patchValue() {
    setTimeout(() => {
      this.orderParams.api.setRowData([this.selectedOrder]);
      this.partParams.api.setRowData(this.partsOfOrder);
      this.calculateFooterDetail();
    }, 300);
  }

  reset() {
    this.selectedOrder = undefined;
    this.partsOfOrder = [];
  }

  // ====**** ORDER GRID ****====
  callBackGridOrder(params) {
    this.orderParams = params;
  }

  // ====**** PART OF ORDER GRID ****====
  callBackGridPart(params) {
    this.partParams = params;
  }

  placeOrder() {
    this.loadingService.setDisplay(true);
    const data = Object.assign({}, {order: this.selectedOrder, parts: this.partsOfOrder});
    this.partsNonLexusOrderLexusApi.lexusOrderToTmv(data).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.toastService.openSuccessToast(`Tạo thành công đơn hàng số ${res.speordNo}`);
      this.close.emit();
      this.modal.hide();
    });
  }

  calculateFooterDetail() {
    const footerDetail = this.gridTableService.calculateFooterDetail(this.partsOfOrder);
    this.totalPriceBeforeTax = footerDetail.totalPriceBeforeTax;
    this.taxOnly = footerDetail.taxOnly;
    this.totalPriceIncludeTax = footerDetail.totalPriceIncludeTax;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      orderNo: [undefined],
      partsCode: [undefined],
      fromDate: [undefined],
      tmvOrderNo: [undefined],
      status: [undefined],
      toDate: [undefined],
      dlrId: [undefined]
    });
  }
}
