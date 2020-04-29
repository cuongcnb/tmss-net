import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {PartsRetailDetailModel, RetailOrderModel} from '../../../core/models/parts-management/parts-retail.model';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {PartsRetailApi} from '../../../api/parts-management/parts-retail.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {CustomerTypeModel} from '../../../core/models/common-models/customer-type-model';
import {BankModel} from '../../../core/models/common-models/bank-model';
import {CustomerTypeApi} from '../../../api/customer/customer-type.api';
import {BankApi} from '../../../api/common-api/bank.api';
import {forkJoin} from 'rxjs';
import {DownloadService} from '../../../shared/common-service/download.service';
import {TMSSTabs} from '../../../core/constains/tabs';
import {EventBusService} from '../../../shared/common-service/event-bus.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-retail',
  templateUrl: './parts-retail.component.html',
  styleUrls: ['./parts-retail.component.scss']
})
export class PartsRetailComponent implements OnInit {
  @ViewChild('newOrderModal', {static: false}) newOrderModal;
  @ViewChild('partRetailDetail', {static: false}) partRetailDetail;
  form: FormGroup;
  customerTypeArr: Array<CustomerTypeModel>;
  bankArr: Array<BankModel>;
  orderListGrid;
  orderListParams;
  orderList: Array<RetailOrderModel>;
  selectedOrder: RetailOrderModel;

  orderDetailData: PartsRetailDetailModel = {customer: {}, parts: []};

  paginationParams;
  paginationTotalsData: number;

  screenHeight: number;

  onResize() {
    this.screenHeight = window.innerHeight - 200;
  }

  constructor(
    private formBuilder: FormBuilder,
    private customerTypeApi: CustomerTypeApi,
    private bankApi: BankApi,
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private partsRetailApi: PartsRetailApi,
    private gridTableService: GridTableService,
    private downloadService: DownloadService,
    private eventBus: EventBusService
  ) {
    this.orderListGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 20
      },
      {
        headerName: 'Số đơn hàng',
        headerTooltip: 'Số đơn hàng',
        field: 'ctno'
      }
    ];
  }

  ngOnInit() {
    this.buildForm();
    this.masterApi();
    this.onResize();
    this.catchEventSaveOrderPartsRetail();
  }

  masterApi() {
    this.loadingService.setDisplay(true);
    forkJoin([
      this.customerTypeApi.getAll(false),
      this.bankApi.getBanksByDealer()
    ]).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.customerTypeArr = res[0];
      this.bankArr = res[1];
    });
  }

  // Order Grid
  changePaginationParams(paginationParams) {
    if (!this.orderList) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  callBackOrderList(params) {
    this.orderListParams = params;
  }

  getParamsOrderList() {
    const selectedOrder = this.orderListParams.api.getSelectedRows();
    if (selectedOrder) {
      this.selectedOrder = selectedOrder[0];
      if (this.selectedOrder) {
        this.getOrderDetail(this.selectedOrder.id);
      }
    }
  }

  search(updateOrder?) {
    this.loadingService.setDisplay(true);
    for (const key in this.form.value) {
      if (this.form.value[key] === '') {
        this.form.value[key] = null;
      }
    }
    this.partsRetailApi.searchRetailOrder(this.form.value, this.paginationParams).subscribe(orderList => {
      this.loadingService.setDisplay(false);
      this.orderList = orderList.list;
      this.paginationTotalsData = orderList.total;
      this.orderListParams.api.setRowData(this.gridTableService.addSttToData(this.orderList));
      if (this.orderList.length) {
        updateOrder
          ? this.gridTableService.autoSelectRow(this.orderListParams, this.orderList, this.selectedOrder)
          : this.gridTableService.selectFirstRow(this.orderListParams);
      } else {
        this.orderDetailData = {parts: [], customer: {}};
        this.selectedOrder = null;
      }
    });
  }

  refreshAfterEdit(updatedValue) {
    !updatedValue || !this.selectedOrder || updatedValue.id !== this.selectedOrder.id
      ? this.search() : this.search(true);
  }

  updateOrder() {
    if (!this.selectedOrder) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn đơn hàng, hãy chọn một đơn hàng để xóa');
      return;
    }
    if (this.selectedOrder.csstate === '6') {
      this.swalAlertService.openWarningToast('Đơn hàng đã đóng, không được phép thay đổi');
      return;
    }
    this.openTab({selectedOrder: this.selectedOrder, orderDetailData: this.orderDetailData});
  }

  deleteSelectedOrder() {
    if (!this.selectedOrder) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn đơn hàng, hãy chọn một đơn hàng để xóa');
      return;
    }
    this.loadingService.setDisplay(true);
    this.partsRetailApi.deleteOrder(this.selectedOrder.id).subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.search();
      this.loadingService.setDisplay(false);
    });
  }

  getOrderDetail(orderId) {
    this.loadingService.setDisplay(true);
    this.partsRetailApi.getOrderDetail(orderId).subscribe(orderDetailData => {
      this.loadingService.setDisplay(false);
      this.orderDetailData = orderDetailData;
    });
  }

  checkBeforePrint(): boolean {
    if (!this.selectedOrder) {
      this.swalAlertService.openWarningToast('Bạn cần chọn một đơn hàng để thực hiện thao tác');
      return false;
    }
    return true;
  }

  printQuotation(extension) {
    if (!this.checkBeforePrint()) {
      return;
    }
    this.loadingService.setDisplay(true);
    this.partsRetailApi.printQuotation(this.selectedOrder.id, extension).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(res);
      this.getOrderDetail(this.selectedOrder.id);
    });
  }

  print(params) {
    switch (params.type) {
      case 1:
        this.printLxpt(params);
        break;
      case 2:
        this.printInvoice(params);
        break;
      case 3:
        this.printQuotation(params.extension);
        break;
    }
  }

  printInvoice(params) {
    if (!this.selectedOrder) {
      this.swalAlertService.openWarningToast('Bạn cần chọn một đơn hàng để thực hiện thao tác');
      return false;
    }
    this.loadingService.setDisplay(true);
    const obj = {
      counterSaleId: this.selectedOrder.id,
      extension: params.extension
    };
    this.partsRetailApi.printInvoice(obj).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(res);
      this.getOrderDetail(this.selectedOrder.id);
    });
  }

  printLxpt(params) {
    if (!this.selectedOrder) {
      this.swalAlertService.openWarningToast('Bạn cần chọn một đơn hàng để thực hiện thao tác');
      return false;
    }
    this.loadingService.setDisplay(true);
    const obj = {
      counterSaleId: this.selectedOrder.id,
      extension: params.extension
    };
    this.partsRetailApi.printLxpt(obj).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(res);
      this.getOrderDetail(this.selectedOrder.id);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      orderNo: [undefined],
      customerCode: [undefined],
      customerName: [undefined],
      mobile: [undefined]
    });
  }

  openTab(data?) {
    this.eventBus.emit({
      type: 'openComponent',
      functionCode: TMSSTabs.dlrPartsRetailNewTabOrder,
      selectDataPartsRetail: data ? data : {}
    });
  }

  catchEventSaveOrderPartsRetail() {
    this.eventBus.on('saveOrderPartsRetail').subscribe(res => {
        this.refreshAfterEdit(res.selectOrder);
      }
    );
  }
}
