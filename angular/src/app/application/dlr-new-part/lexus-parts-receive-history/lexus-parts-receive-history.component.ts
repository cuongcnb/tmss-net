import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LexusPartsReceiveHistoryApi} from '../../../api/lexus-order/lexus-parts-receive-history.api';
import {
  OrderHistoryModel,
  PartsOfOrderHistoryModel
} from '../../../core/models/parts-management/parts-order-history.model';
import {LoadingService} from '../../../shared/loading/loading.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {SysUserApi} from '../../../api/system-admin/sys-user.api';
import {ValidateBeforeSearchService} from '../../../shared/common-service/validate-before-search.service';
import {ServiceReportApi} from '../../../api/service-report/service-report.api';
import {DownloadService} from '../../../shared/common-service/download.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lexus-parts-receive-history',
  templateUrl: './lexus-parts-receive-history.component.html',
  styleUrls: ['./lexus-parts-receive-history.component.scss']
})
export class LexusPartsReceiveHistoryComponent implements OnInit {
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;
  form: FormGroup;

  fieldGridOrder;
  orderParams;
  orderData: Array<OrderHistoryModel> = [];
  selectedOrder: OrderHistoryModel;

  fieldGridParts;
  partsParams;
  partsOfOrder: Array<PartsOfOrderHistoryModel>;

  paginationTotalsData: number;
  paginationParams;

  sysAppUser = [];
  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService,
    private sysUserApi: SysUserApi,
    private validateBeforeSearchService: ValidateBeforeSearchService,
    private lexusPartsReceiveHistoryApi: LexusPartsReceiveHistoryApi,
    private downloadService: DownloadService,
    private serviceReportApi: ServiceReportApi
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.getSysAppUser();
    this.initGrid();
  }

  initGrid() {
    this.fieldGridOrder = [
      {
        headerName: 'Số phiếu giao hàng',
        headerTooltip: 'Số phiếu giao hàng',
        field: 'svourcher'
      },
      {
        headerName: 'Đơn hàng LCS gửi TMV',
        headerTooltip: 'Đơn hàng LCS gửi TMV',
        field: 'orderNo'
      },
      {
        headerName: 'Số hóa đơn',
        headerTooltip: 'Số hóa đơn',
        field: 'invoiceno'
      },
      {
        headerName: 'Ngày giao',
        headerTooltip: 'Ngày giao',
        field: 'shipdate',
        cellClass: ['cell-border', 'cell-readonly'],
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'Người nhận',
        headerTooltip: 'Người nhận',
        field: 'modifiedBy',
        valueFormatter: params => {
          const matchedUser = this.sysAppUser.find(user => user.id === params.value);
          return matchedUser.fullUserName;
        }
      },
      {
        headerName: 'Ngày nhận',
        headerTooltip: 'Ngày nhận',
        field: 'invoiceDate',
        cellClass: ['cell-border', 'cell-readonly'],
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'Đơn hàng DLR gửi LCS',
        headerTooltip: 'Đơn hàng LCS gửi TMV',
        field: 'lexordNo'
      }
    ];
    this.fieldGridParts = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 80
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode'
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsName'
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit'
      },
      {
        headerName: 'SL Đặt',
        headerTooltip: 'Số lượng đặt',
        field: 'qty',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'SL Giao',
        headerTooltip: 'Số lượng giao',
        field: 'recvQty',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'SL thực nhận',
        headerTooltip: 'Số lượng thực nhận',
        field: 'recvActQty',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'sumPrice',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'Vị trí',
        headerTooltip: 'Vị trí',
        field: 'locationNo'
      }
    ];
  }

  getSysAppUser() {
    this.loadingService.setDisplay(true);
    this.sysUserApi.getAllUser().subscribe(sysAppUser => {
      this.loadingService.setDisplay(false);
      this.sysAppUser = sysAppUser;
    });
  }

  search() {
    if (!this.validateBeforeSearchService.validSearchDateRange(this.form.value.fromDate, this.form.value.toDate)) {
      return;
    }
    const formValue = this.validateBeforeSearchService.setBlankFieldsToNull(this.form.value);
    this.loadingService.setDisplay(true);
    this.lexusPartsReceiveHistoryApi.search(formValue, this.paginationParams).subscribe(orderData => {
      this.loadingService.setDisplay(false);
      this.paginationTotalsData = orderData.total;
      this.orderData = orderData.list;
      this.orderParams.api.setRowData(this.gridTableService.addSttToData(this.orderData));
      if (this.orderData.length) {
        this.gridTableService.selectFirstRow(this.orderParams);
      } else {
        this.partsOfOrder = [];
        this.partsParams.api.setRowData(this.partsOfOrder);
        this.calculateFooterDetail();
      }
    });
  }

  callbackGridOrder(params) {
    this.orderParams = params;
  }

  getParamsOrder() {
    const selectedOrder = this.orderParams.api.getSelectedRows();
    if (selectedOrder) {
      this.selectedOrder = selectedOrder[0];
      this.getPartsOfOrder();
    }
  }

  callbackGridParts(params) {
    this.partsParams = params;
  }

  getPartsOfOrder() {
    this.loadingService.setDisplay(true);
    this.lexusPartsReceiveHistoryApi.getPartByInvoice(this.selectedOrder.id).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.partsOfOrder = res.parts;
      this.calculateFooterDetail(res);
      this.partsParams.api.setRowData(this.gridTableService.addSttToData(this.partsOfOrder));
      this.gridTableService.autoSizeColumn(this.partsParams);
    });
  }

  calculateFooterDetail(res?) {
    this.totalPriceBeforeTax = res ? this.dataFormatService.moneyFormat(res.price.preTaxPrice) : 0;
    this.taxOnly = res ? this.dataFormatService.moneyFormat(res.price.taxPrice) : 0;
    this.totalPriceIncludeTax = res ? this.dataFormatService.moneyFormat(res.price.totalPrice) : 0;
  }

  changePaginationParams(paginationParams) {
    if (!this.orderData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  downloadReport(data) {
    const obj = {
      svoucher: this.selectedOrder.svourcher,
      ...data
    };
    this.serviceReportApi.printLexusReceiveHistory(obj).subscribe(res => {
      this.downloadService.downloadFile(res);
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      svourcher: [undefined],
      lexordNo: [undefined],
      fromDate: [new Date(year, month, 1)],
      toDate: [new Date(year, month, date, 23, 59, 59)]
    });
  }

}
