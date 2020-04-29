import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PartsReceiveHistoryApi} from '../../../api/parts-management/parts-receive-history.api';
import {
  OrderHistoryModel,
  PartsOfOrderHistoryModel
} from '../../../core/models/parts-management/parts-order-history.model';
import {LoadingService} from '../../../shared/loading/loading.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {SysUserApi} from '../../../api/system-admin/sys-user.api';
import {ValidateBeforeSearchService} from '../../../shared/common-service/validate-before-search.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-receive-history',
  templateUrl: './parts-receive-history.component.html',
  styleUrls: ['./parts-receive-history.component.scss']
})
export class PartsReceiveHistoryComponent implements OnInit {
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
    private partsReceiveHistoryApi: PartsReceiveHistoryApi,
    private validateBeforeSearchService: ValidateBeforeSearchService
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
        headerName: 'Số đơn hàng',
        headerTooltip: 'Số đơn hàng',
        field: 'orderno'
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
        field: 'modifyDate',
        cellClass: ['cell-border', 'cell-readonly'],
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
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
        field: 'partscode'
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsname'
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unitName'
      },
      {
        headerName: 'SL Đặt',
        headerTooltip: 'Số lượng đặt',
        field: 'qtyOrder',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'SL Giao',
        headerTooltip: 'Số lượng giao',
        field: 'qtyRecv',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'SL thực nhận',
        headerTooltip: 'Số lượng thực nhận',
        field: 'qtyRecvact',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'netprice',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'amtBeforeTax',
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
    this.partsReceiveHistoryApi.search(formValue, this.paginationParams).subscribe(orderData => {
      this.loadingService.setDisplay(false);
      const key = Object.keys(orderData);
      this.paginationTotalsData = Number(key[0]);
      this.orderData = orderData[key[0]];
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
    this.partsReceiveHistoryApi.getPartsOfOrder(this.selectedOrder).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.partsOfOrder = res.srvBPartsreceivingDDTOs;
      this.calculateFooterDetail(res);
      this.partsParams.api.setRowData(this.gridTableService.addSttToData(this.partsOfOrder));
      this.gridTableService.autoSizeColumn(this.partsParams);
    });
  }

  calculateFooterDetail(res?) {
    this.totalPriceBeforeTax = res ? this.dataFormatService.moneyFormat(res.totalAmtBeforeTax) : 0;
    this.taxOnly = res ? this.dataFormatService.moneyFormat(res.totalTax) : 0;
    this.totalPriceIncludeTax = res ? this.dataFormatService.moneyFormat(res.totalAmtAfterTax) : 0;
  }

  changePaginationParams(paginationParams) {
    if (!this.orderData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      voucherNo: [undefined],
      fromDate: [new Date(year, month, 1)],
      toDate: [new Date(year, month, date, 23, 59, 59)]
    });
  }

}
