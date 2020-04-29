import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {forkJoin} from 'rxjs';

import {ManualOrderModel, PartsOfManualOrderModel} from '../../../core/models/parts-management/parts-manual-order.model';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {PartsManualOrderApi} from '../../../api/parts-management/parts-manual-order.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {TransportTypeModel} from '../../../core/models/common-models/transport-type.model';
import {TransportTypeApi} from '../../../api/common-api/transport-type.api';
import {OrderMethodApi} from '../../../api/common-api/order-method.api';
import {OrderMethodModel} from '../../../core/models/common-models/order-method.model';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {ValidateBeforeSearchService} from '../../../shared/common-service/validate-before-search.service';
import {TMSSTabs} from '../../../core/constains/tabs';
import {EventBusService} from '../../../shared/common-service/event-bus.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-manual-order',
  templateUrl: './parts-manual-order.component.html',
  styleUrls: ['./parts-manual-order.component.scss']
})
export class PartsManualOrderComponent implements OnInit {
  @ViewChild('editPartModal', {static: false}) editPartModal;
  @ViewChild('newManualOrderModal', {static: false}) newManualOrderModal;
  @ViewChild('selectPackOfPartsModal', {static: false}) selectPackOfPartsModal;
  form: FormGroup;

  fieldGridOrder;
  orderParams;
  orderList: Array<ManualOrderModel>;
  selectedOrder: ManualOrderModel;

  fieldGridParts;
  partsOfOrderParams;
  partsOfOrderList: Array<PartsOfManualOrderModel> = [];
  selectedPart: PartsOfManualOrderModel;

  transportTypeList: Array<TransportTypeModel>;
  orderMethodArr: Array<OrderMethodModel> = [];

  paginationTotalsOrder;
  orderPaginationParams;
  paginationTotalsPart;
  partPaginationParams;

  constructor(
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService,
    private confirmService: ConfirmService,
    private swalAlertService: ToastService,
    private partsManualOrderApi: PartsManualOrderApi,
    private transportTypeApi: TransportTypeApi,
    private orderMethodApi: OrderMethodApi,
    private gridTableService: GridTableService,
    private validateBeforeSearchService: ValidateBeforeSearchService,
    private eventBus: EventBusService
  ) {
    this.fieldGridOrder = [
      {headerName: 'Số đơn hàng', headerTooltip: 'Số đơn hàng', field: 'orderNo'},
      {
        headerName: 'Ngày giờ đặt hàng', headerTooltip: 'Ngày giờ đặt hàng', field: 'createDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {headerName: 'Người đặt hàng', headerTooltip: 'Người đặt hàng', field: 'createPerson'},
      {headerName: 'PTVC', headerTooltip: 'Phương thức vận chuyển', field: 'transportTypeName'},
      {headerName: 'Loại đặt hàng', headerTooltip: 'Loại đặt hàng', field: 'orderTypeName'}
    ];
    this.fieldGridParts = [
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {headerName: 'STT', headerTooltip: 'Số thứ tự', field: 'stt', width: 30},
          {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode', width: 100},
          {
            headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
              return params.data && params.data.partsNameVn
              && !!params.data.partsNameVn ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
            }, width: 120
          },
          {headerName: 'ĐVT', headerTooltip: 'Đơn vị tính', field: 'unit', width: 40},
          {headerName: 'DAD', headerTooltip: 'DAD', field: 'dad', width: 40, cellClass: ['text-right', 'cell-border', 'cell-readonly']},
          {headerName: 'SL Tồn', headerTooltip: 'Số lượng Tồn', field: 'onHandQty', width: 50, cellClass: ['text-right', 'cell-border', 'cell-readonly']},
          {headerName: 'SL ĐĐ', headerTooltip: 'Số lượng ĐĐ', field: 'onOrderQty', width: 50, cellClass: ['text-right', 'cell-border', 'cell-readonly']},
          {headerName: 'MIP', headerTooltip: 'MIP', field: 'mip', width: 40, cellClass: ['text-right', 'cell-border', 'cell-readonly']},
          {headerName: 'SL đặt DK', headerTooltip: 'Số lượng đặt DK', field: 'suggestOrderQty', width: 70, cellClass: ['text-right', 'cell-border', 'cell-readonly']}
        ]
      },
      {
        headerName: 'Tồn kho TMV',
        headerTooltip: 'Tồn kho TMV',
        children: [
          {headerName: 'CPD', headerTooltip: 'CPD', field: 'cpd', width: 40, cellClass: ['text-right', 'cell-border', 'cell-readonly']},
          {headerName: 'SPD', headerTooltip: 'SPD', field: 'spd', width: 40, cellClass: ['text-right', 'cell-border', 'cell-readonly']},
          {headerName: 'Max Allocate', headerTooltip: 'Max Allocate', field: 'maxAllocate', width: 80, cellClass: ['text-right', 'cell-border', 'cell-readonly']}
        ]
      },
      {
        headerName: 'SL Đặt thực tế',
        headerTooltip: 'Số lượng Đặt thực tế',
        children: [
          {headerName: 'SL Đặt', headerTooltip: 'Số lượng Đặt', field: 'qty', width: 55, cellClass: ['text-right', 'cell-border', 'cell-readonly']},
          {headerName: 'BO', headerTooltip: 'BO', field: 'boQty', width: 30, cellClass: ['text-right', 'cell-border', 'cell-readonly']}
        ]
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'price', width: 75,
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
            cellClass: ['text-right', 'cell-border', 'cell-readonly']
          },
          {
            headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'sumPrice', width: 100,
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
            cellClass: ['text-right', 'cell-border', 'cell-readonly']
          },
          {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'rate', width: 40, cellClass: ['text-right', 'cell-border', 'cell-readonly']}
        ]
      }
    ];
  }

  ngOnInit() {
    this.catchEventNewManualTabOrder();
    this.masterDataApi();
  }

  masterDataApi() {
    this.loadingService.setDisplay(true);
    forkJoin([
      this.orderMethodApi.getListForManualOrder(),
      this.transportTypeApi.getAll(false)
    ]).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.orderMethodArr = res[0];
      this.transportTypeList = res[1];
      this.buildForm();
    });
  }

  // =====**** Order Grid ****=====
  callBackGridOrder(params) {
    this.orderParams = params;
  }

  getParamsOrder() {
    const selectedOrder = this.orderParams.api.getSelectedRows();
    if (selectedOrder) {
      this.selectedOrder = selectedOrder[0];
      this.getPartsOfOrder();
    }
  }

  changePaginationOrder(paginationParams) {
    if (!this.orderList) {
      return;
    }
    this.orderPaginationParams = paginationParams;
    this.searchOrder();
  }

  resetPaginationParams(resetPart?) {
    if (!resetPart) {
      if (this.orderPaginationParams) {
        this.orderPaginationParams.page = 1;
      }
      this.paginationTotalsOrder = 0;
    } else {
      if (this.partPaginationParams) {
        this.partPaginationParams.page = 1;
      }
      this.paginationTotalsPart = 0;
    }
  }

  searchOrder() {
    if (!this.validateBeforeSearchService.validSearchDateRange(this.form.value.fromDate, this.form.value.toDate)) {
      return;
    }
    const formValue = this.validateBeforeSearchService.setBlankFieldsToNull(this.form.value);
    this.loadingService.setDisplay(true);
    this.partsManualOrderApi.searchManualPart(formValue, this.orderPaginationParams).subscribe(manualOrderData => {
      this.loadingService.setDisplay(false);
      this.orderList = manualOrderData.list;
      this.paginationTotalsOrder = manualOrderData.total;
      this.orderParams.api.setRowData(this.orderList);
      if (this.orderList.length) {
        this.gridTableService.selectFirstRow(this.orderParams);
      } else {
        this.partsOfOrderList = [];
        this.paginationTotalsPart = 0;
        this.partsOfOrderParams.api.setRowData(this.gridTableService.addSttToData(this.partsOfOrderList));
      }
    });
  }

  refreshAfterEdit(updatedValue) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form.patchValue({
      orderNo: updatedValue.orderno,
      partsCode: undefined,
      fromDate: new Date(year, month, 1).getTime(),
      toDate: new Date(year, month, date, 23, 59, 59).getTime(),
      orderPersonId: undefined,
      transportTypeId: undefined,
      orderTypeId: updatedValue.ordermethodId
    });
    this.searchOrder();
  }

  updateOrder() {
    !this.selectedOrder
      ? this.swalAlertService.openWarningToast('Bạn chưa chọn đơn hàng, hãy chọn một đơn hàng để sửa')
      : this.newManualOrderModal.open(this.selectedOrder, this.partsOfOrderList);
  }

  // =====**** Part Grid ****=====
  callBackGridParts(params) {
    this.partsOfOrderParams = params;
  }

  getParamsParts() {
    const selectedPart = this.partsOfOrderParams.api.getSelectedRows();
    if (selectedPart) {
      this.selectedPart = selectedPart[0];
    }
  }

  changePaginationPart(paginationParams) {
    if (!this.orderList) {
      return;
    }
    this.partPaginationParams = paginationParams;
    this.getPartsOfOrder();
  }

  getPartsOfOrder() {
    this.loadingService.setDisplay(true);
    this.partsManualOrderApi.getPartsOfOrder(this.selectedOrder.id, this.partPaginationParams).subscribe(partsOfOrderList => {
      this.partsOfOrderList = partsOfOrderList.list;
      this.paginationTotalsPart = partsOfOrderList.total;
      this.partsOfOrderParams.api.setRowData(this.gridTableService.addSttToData(this.partsOfOrderList, this.partPaginationParams));
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      orderNo: [undefined],
      fromDate: [new Date(year, month, 1).getTime()],
      toDate: [new Date(year, month, date, 23, 59, 59).getTime()],
      orderPersonId: [undefined],
      transportTypeId: [undefined],
      orderTypeId: [undefined]
    });
  }

  openTab(data?) {
    this.eventBus.emit({
      type: 'openComponent',
      functionCode: TMSSTabs.newManualTabOrder
    });
  }

  catchEventNewManualTabOrder() {
    this.eventBus.on('newManualTabOrder').subscribe(res => {
        this.resetPaginationParams();
        this.searchOrder();
      }
    );
  }
}
