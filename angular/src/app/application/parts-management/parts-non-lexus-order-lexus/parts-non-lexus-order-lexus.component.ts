import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DealerModel} from '../../../core/models/sales/dealer.model';
import {
  DlrNonLexusOrderLexusOrderModel,
  DlrNonLexusOrderLexusPartModel
} from '../../../core/models/parts-management/parts-non-lexus-order-lexus.model';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {ValidateBeforeSearchService} from '../../../shared/common-service/validate-before-search.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {PartsNonLexusOrderLexusApi} from '../../../api/parts-management/parts-non-lexus-order-lexus.api';
import {AgCheckboxRendererComponent} from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import {CurrentUser} from '../../../home/home.component';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {CurrentUserModel} from '../../../core/models/base.model';
import {forkJoin} from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-non-lexus-order-lexus',
  templateUrl: './parts-non-lexus-order-lexus.component.html',
  styleUrls: ['./parts-non-lexus-order-lexus.component.scss']
})
export class PartsNonLexusOrderLexusComponent implements OnInit {
  @ViewChild('orderTmvModal', {static: false}) orderTmvModal;
  currentUser: CurrentUserModel = CurrentUser;
  form: FormGroup;

  fieldGridOrder;
  orderParams;
  orderList: Array<DlrNonLexusOrderLexusOrderModel> = [];
  orderListForExport: Array<DlrNonLexusOrderLexusOrderModel> = [];
  selectedOrder: DlrNonLexusOrderLexusOrderModel;
  frameworkComponents;

  fieldGridPart;
  partParams;
  partsOfOrder: Array<DlrNonLexusOrderLexusPartModel>;

  childDealerOfLexus: Array<{ abbreviation: string, dlrCode: string, id: number }> = [];
  allDealer: Array<DealerModel> = [];
  // when '1' then N'Đại lý mới gửi'
  // when '3' then N'Đã gửi TMV'
  // when '4' then N'Lexus đã trả hàng'
  // when '6' then N'Hoàn thành'
  // when '9' then N'Từ chối'
  orderStatusArr = [
    {key: '1', value: 'Đại lý mới gửi'},
    {key: '3', value: 'Đã gửi TMV'},
    {key: '4', value: 'Lexus đã trả hàng'},
    {key: '6', value: 'Hoàn thành'},
    {key: '9', value: 'Từ chối'}
  ];

  fieldGridExport;
  exportParams;
  editingRowParams;

  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  constructor(
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private gridTableService: GridTableService,
    private validateBeforeSearchService: ValidateBeforeSearchService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private partsNonLexusOrderLexusApi: PartsNonLexusOrderLexusApi,
    private dealerApi: DealerApi
  ) {
  }

  ngOnInit() {
    this.buildForm();
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
        field: 'remarkTmv',
        cellClass: this.currentUser.isLexus ? ['cell-border', 'lexusNote'] : ['cell-readonly', 'cell-border', 'lexusNote'],
        editable: this.currentUser.isLexus
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'statusName',
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: this.orderStatusArr.map(status => status.value)
        },
        // editable: params => this.currentUser.isLexus && params.data.status === '1',
        editable: this.currentUser.isLexus,
        cellClass: this.currentUser.isLexus ? ['cell-border'] : ['cell-readonly', 'cell-border']
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
    this.fieldGridExport = [
      {
        headerName: 'Mã ĐL',
        headerTooltip: 'Mã đại lý',
        field: 'dlrcode',
        width: 80,
        cellClass: ['cellBorder', 'excelStringType']
      },
      {
        headerName: 'Số đơn hàng',
        headerTooltip: 'Số đơn hàng',
        field: 'orderno',
        width: 80,
        cellClass: 'cellBorder'
      },
      {
        headerName: 'Số ĐH gửi TMV',
        headerTooltip: 'Số ĐH gửi TMV',
        field: 'tmvordNo',
        width: 80,
        cellClass: 'cellBorder'
      },
      {
        headerName: 'ĐL nhận',
        headerTooltip: 'ĐL nhận',
        field: 'receivedlr',
        width: 80,
        cellClass: ['cellBorder', 'excelStringType']
      },
      {
        headerName: 'Đại lý Ghi chú',
        headerTooltip: 'Đại lý Ghi chú',
        field: 'remark',
        width: 80,
        cellClass: 'cellBorder'
      },
      {
        headerName: 'Lexus Ghi chú',
        headerTooltip: 'Lexus Ghi chú',
        field: 'remarkTmv',
        cellClass: 'cellBorder',
        width: 80
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'statusName',
        width: 80,
        cellClass: 'cellBorder'
      },
      {
        headerName: 'PTVC',
        headerTooltip: 'PTVC',
        field: 'transporttype',
        cellClass: 'cellBorder'
      },
      {
        headerName: 'Ngày tạo',
        headerTooltip: 'Ngày tạo',
        field: 'createDate',
        width: 80,
        cellClass: ['cellBorder', 'excelDateTimeType']
      }
    ];
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent
    };
    this.getDealers();
  }

  private getDealers() {
    this.loadingService.setDisplay(true);
    forkJoin([
      this.dealerApi.getDealerNotLexus(),
      this.partsNonLexusOrderLexusApi.getChildDealerOfLexus()
    ]).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.allDealer = res[0];
      this.childDealerOfLexus = res[1];
    });
  }

  // ====**** ORDER GRID ****====
  callBackGridOrder(params) {
    this.orderParams = params;
  }

  getParamsOrder() {
    const selectedOrder = this.orderParams.api.getSelectedRows();
    this.orderListForExport = [];
    if (selectedOrder) {
      selectedOrder.forEach(it => this.orderListForExport.push(it));
      this.selectedOrder = selectedOrder[selectedOrder.length - 1];
      this.getPartsOfOrder();
    }
  }

  cellEditingStopped(params) {
    const field = params.colDef.field;
    if (field === 'statusName') {
      if (params.column.editingStartedValue === params.data.statusName) {
        return;
      }
      params.data.status = this.orderStatusArr.find(status => status.value === params.data.statusName).key;
      params.api.refreshCells();
      if (params.value !== params.column.editingStartedValue) {
        // if value is different, call api
        this.lexusUpdateData(params.data);
      }
    }
    if (field === 'remarkTmv') {
      if (params.column.editingStartedValue === params.data.lexusNote) {
        return;
      }
      if (params.value.trim() !== '' && params.value !== params.column.editingStartedValue) {
        this.lexusUpdateData(params.data);
      }
    }
  }

  cellValueChanged(params) {
    // const field = params.colDef.field;
    // if (field === 'checkForExport') {
    //   if (params.data[field]) {
    //     this.orderListForExport.push(params.data);
    //   } else if (this.orderListForExport.length) {
    //     remove(this.orderListForExport, params.data);
    //   }
    // }
  }

  cellEditingStarted(params) {
    this.editingRowParams = params;
  }

  agKeyUp(event: KeyboardEvent) {
    const keyCode = event.key;
    const classList = (event.target as HTMLInputElement).classList;
    if (classList.contains('tmvNote') && keyCode === 'Enter') {
      if (this.editingRowParams) {
        this.lexusUpdateData(this.editingRowParams.data);
        this.editingRowParams = null;
      }
    }
  }

  lexusUpdateData(data) {
    const orderData = Object.assign({}, {
      order: data,
      parts: this.partsOfOrder
    });
    this.loadingService.setDisplay(true);
    this.partsNonLexusOrderLexusApi.updateOrder(orderData).subscribe(() => {
      this.searchOrder();
      this.loadingService.setDisplay(false);
      return;
    }, () => {
      // reset value if error
      this.editingRowParams.node.setDataValue(this.editingRowParams.colDef.field, this.editingRowParams.column.editingStartedValue);
      this.editingRowParams.api.setFocusedCell(this.editingRowParams.rowIndex, this.editingRowParams.colDef.field);
    });
  }

  searchOrder() {
    if (!this.validateBeforeSearchService.validSearchDateRange(this.form.value.fromDate, this.form.value.toDate)) {
      return;
    }
    const formValue = this.validateBeforeSearchService.setBlankFieldsToNull(this.form.value);
    this.loadingService.setDisplay(true);
    this.partsNonLexusOrderLexusApi.searchOrder(formValue).subscribe((res: DlrNonLexusOrderLexusOrderModel[]) => {
      this.orderListForExport = [];
      this.loadingService.setDisplay(false);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < res.length; i++) {
        for (const dealer of this.allDealer) {
          if (res[i].dlrId === dealer.id) {
            res[i].dlrCodeDisplay = dealer.code;
            // break;
          }
        }
      }
      this.orderList = res;
      this.orderParams.api.setRowData(this.orderList);
      if (this.orderList.length) {
        this.gridTableService.autoSelectRow(this.orderParams, this.orderList, this.selectedOrder);
      } else {
        this.partsOfOrder = [];
        this.partParams.api.setRowData(this.partsOfOrder);
        this.calculateFooterDetail();
      }
    });
  }

  // ====**** PART OF ORDER GRID ****====
  getPartsOfOrder() {
    if (this.selectedOrder) {
      this.loadingService.setDisplay(true);
      const searchOrder = Object.assign(this.selectedOrder, {
        orderId: this.selectedOrder.id
      });
      this.partsNonLexusOrderLexusApi.searchPartOfOrder(searchOrder).subscribe(res => {
        this.loadingService.setDisplay(false);
        this.partsOfOrder = res.parts;
        this.partParams.api.setRowData(this.gridTableService.addSttToData(this.partsOfOrder));
        this.calculateFooterDetail();
      });
    }
  }

  callBackGridPart(params) {
    this.partParams = params;
  }

  exportExcel() {
    if (this.orderListForExport.length === 0) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn đơn hàng, hãy chọn ít nhất một đơn hàng để xuất dữ liệu', 'Cảnh báo');
      return;
    }
    const fileName = this.gridTableService.generateExportFileName('DonHangDaiLyGuiLexus', StorageKeys.partsNonLexusOrderLexus);
    const ids = [];
    this.orderListForExport.forEach(data => {
      ids.push(data.id);
    });
    this.loadingService.setDisplay(true);
    this.partsNonLexusOrderLexusApi.export(ids).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.exportParams.api.setRowData(res ? res : []);
      this.gridTableService.export(this.exportParams, fileName);
    });
  }

  openPartSpecialOrder() {
    if (!this.selectedOrder) {
      this.swalAlertService.openWarningToast('Chưa chọn đơn hàng, vui lòng chọn một đơn hàng để đặt hàng.');
      return;
    }
    this.orderTmvModal.open(this.selectedOrder, this.partsOfOrder);
  }

  calculateFooterDetail() {
    const footerDetail = this.gridTableService.calculateFooterDetail(this.partsOfOrder);
    this.totalPriceBeforeTax = footerDetail.totalPriceBeforeTax;
    this.taxOnly = footerDetail.taxOnly;
    this.totalPriceIncludeTax = footerDetail.totalPriceIncludeTax;
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      orderNo: [undefined],
      partsCode: [undefined],
      fromDate: [new Date(year, month, 1).getTime()],
      tmvOrderNo: [undefined],
      status: [5],
      toDate: [new Date(year, month, date, 23, 59, 59).getTime()],
      dlrId: [!this.currentUser.isLexus ? this.currentUser.dealerId : -1]
    });
  }
}
