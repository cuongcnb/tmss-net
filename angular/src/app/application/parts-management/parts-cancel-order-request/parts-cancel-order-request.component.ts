import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { RequestCancelOrderModel } from '../../../core/models/parts-management/parts-cancel-order-request.model';
import { PartsCancelOrderRequestApi } from '../../../api/parts-management/parts-cancel-order-request.api';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { TransportTypeApi } from '../../../api/common-api/transport-type.api';
import { TransportTypeModel } from '../../../core/models/common-models/transport-type.model';
import { OrderMethodModel } from '../../../core/models/common-models/order-method.model';
import { OrderMethodApi } from '../../../api/common-api/order-method.api';
import { forkJoin } from 'rxjs';
import { ValidateBeforeSearchService } from '../../../shared/common-service/validate-before-search.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-cancel-order-request',
  templateUrl: './parts-cancel-order-request.component.html',
  styleUrls: ['./parts-cancel-order-request.component.scss'],
})
export class PartsCancelOrderRequestComponent implements OnInit {
  form: FormGroup;
  transportTypeList: Array<TransportTypeModel>;
  orderMethodList: Array<OrderMethodModel>;

  fieldGridOrder;
  orderParams;
  orderData: Array<RequestCancelOrderModel>;
  selectedOrderArr: Array<RequestCancelOrderModel>;
  selectedOrder: RequestCancelOrderModel;
  agDaHuyRow = {color: '#000', backgroundColor: '#00E0E0 !important'};

  paginationTotalsData;
  paginationParams;

  beforeTax;
  tax;
  taxIncluded;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private partsCancelOrderRequestApi: PartsCancelOrderRequestApi,
    private gridTableService: GridTableService,
    private transportTypeApi: TransportTypeApi,
    private orderMethodApi: OrderMethodApi,
    private validateBeforeSearchService: ValidateBeforeSearchService,
  ) {
    this.fieldGridOrder = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 100,
      },
      {
        headerName: 'Thời gian đặt hàng',
        headerTooltip: 'Thời gian đặt hàng',
        field: 'orderdate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Số ĐH',
        headerTooltip: 'Số ĐH',
        field: 'orderno',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        rowGroup: true,
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partscode',
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsname',
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unitName',
      },
      {
        headerName: 'Nhà CC',
        headerTooltip: 'Nhà CC',
        field: 'supplierCode',
      },
      {
        headerName: 'SL',
        headerTooltip: 'Số lượng',
        field: 'qty',
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
      },
      {
        headerName: 'Thuế (%)',
        headerTooltip: 'Thuế (%)',
        field: 'rate',
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'sumPrice',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
      },
      {
        headerName: 'Trạng thái hủy ĐH',
        headerTooltip: 'Trạng thái hủy ĐH',
        field: 'status',
        cellStyle: params => {
          if (params.value === 'Gửi') {
            return this.agDaHuyRow;
          }
        },
      },
    ];
  }

  ngOnInit() {
    this.masterApi();
    this.buildForm();
  }

  masterApi() {
    this.loadingService.setDisplay(true);
    forkJoin([
      this.transportTypeApi.getAll(),
      this.orderMethodApi.getAll(),
    ]).subscribe(res => {
      this.transportTypeList = res[0];
      this.orderMethodList = res[1];
      this.loadingService.setDisplay(false);
    });
  }

  changePaginationParams(paginationParams) {
    if (!this.orderData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  callBackGridOrder(orderParams) {
    this.orderParams = orderParams;
  }

  getParamsOrder() {
    const selectedOrderArr = this.orderParams.api.getSelectedRows();
    if (selectedOrderArr) {
      this.selectedOrderArr = selectedOrderArr;
      this.selectedOrder = selectedOrderArr[selectedOrderArr.length];
    }
  }

  calculateFooterDetail() {
    const footerDetail = this.gridTableService.calculateFooterDetail(this.orderData);
    this.beforeTax = footerDetail.totalPriceBeforeTax;
    this.tax = footerDetail.taxOnly;
    this.taxIncluded = footerDetail.totalPriceIncludeTax;
  }

  search() {
    if (!this.validateBeforeSearchService.validSearchDateRange(this.form.value.fromDate, this.form.value.toDate)) {
      return;
    }
    this.loadingService.setDisplay(true);
    this.partsCancelOrderRequestApi.searchOrder(this.form.value, this.paginationParams).subscribe(orderData => {
      this.orderData = orderData.list;
      this.paginationTotalsData = orderData.total;
      this.orderParams.api.setRowData(this.gridTableService.addSttToData(this.orderData));
      this.expandAllRows();
      this.calculateFooterDetail();
      this.loadingService.setDisplay(false);
    });
  }

  expandAllRows() {
    this.orderParams.api.forEachNode(node => {
      node.setExpanded(true);
    });
  }

  cancelOrders() {
    if (!this.selectedOrderArr) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn đơn hàng nào để hủy, hãy chọn một đơn hàng để hủy');
      return;
    }
    if (this.checkCanceledOrder()) {
      this.loadingService.setDisplay(true);
      this.partsCancelOrderRequestApi.cancelOrder(this.selectedOrderIdArr).subscribe(() => {
        this.swalAlertService.openSuccessToast();
        this.search();
        this.loadingService.setDisplay(false);
      });
    }
  }

  checkCanceledOrder() {
    const canceledOrderArr = [];
    this.selectedOrderArr.forEach(selectedOrder => {
      if (selectedOrder.status === 'Gửi') {
        canceledOrderArr.push(selectedOrder);
      }
    });

    let message = 'Đơn hàng ';
    if (canceledOrderArr.length) {
      canceledOrderArr.forEach(order => {
        message += canceledOrderArr.indexOf(order) === canceledOrderArr.length - 1 ? `${order.orderno} ` : `${order.orderno}, `;
      });
      this.swalAlertService.openWarningToast(message + `đã được xử lý nên không thể huỷ, hãy bỏ chọn ${canceledOrderArr.length > 1 ? 'các' : ''} đơn hàng đó trước khi huỷ.`);
    }
    return !canceledOrderArr.length;
  }

  get selectedOrderIdArr() {
    const idArr = [];
    this.selectedOrderArr.forEach(order => idArr.push(order.orderId));
    const filteredObj = new Set(idArr);
    return Array.from(filteredObj);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      orderNo: [undefined],
      orderMethodId: [undefined],
      transportationTypeId: [undefined],
      fromDate: [this.gridTableService.firstDayOfMonth],
      toDate: [new Date()],
    });
  }

}
