import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PartsReceiveModel} from '../../../core/models/parts-management/parts-receive.model';
import {PartsReceiveManualApi} from '../../../api/parts-management/parts-receive-manual.api';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {ManualOrderModel} from '../../../core/models/parts-management/manual-order.model';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {PaginationParamsModel} from '../../../core/models/base.model';
import {LoadingService} from '../../../shared/loading/loading.service';
import {TransportTypeApi} from '../../../api/common-api/transport-type.api';
import {OrderMethodApi} from '../../../api/common-api/order-method.api';
import {forkJoin} from 'rxjs';
import {GridTableService} from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-receive-manual',
  templateUrl: './parts-receive-manual.component.html',
  styleUrls: ['./parts-receive-manual.component.scss']
})
export class PartsReceiveManualComponent implements OnInit {
  @ViewChild('partsReceiveManualDetailModal', {static: false}) partsReceiveManualDetailModal;
  @ViewChild('searchDataGridModal', {static: false}) searchDataGridModal;
  @Input() isDlrPartsReceiveNonToyota;
  fieldManualOrderList;
  manualOrderParams;
  manualOrderList: ManualOrderModel[];
  selectedManualOrder: ManualOrderModel;
  searchForm: FormGroup;

  fieldPartsList;
  partsList: PartsReceiveModel[];
  partsParams;
  paginationParams: PaginationParamsModel;
  paginationTotalsData: number;
  orderMethodList;
  transportTypeList;
  totalTax;
  price;
  isNonToyota;

  constructor(private formBuilder: FormBuilder, private partsReceiveManualApi: PartsReceiveManualApi,
              private swalAlertService: ToastService, private dataFormatService: DataFormatService,
              private loadingService: LoadingService, private transportTypeApi: TransportTypeApi,
              private orderMethodApi: OrderMethodApi, private gridTableService: GridTableService) {
    this.fieldManualOrderList = [
      {headerName: 'Số đơn hàng', headerTooltip: 'Số đơn hàng', field: 'orderNo'},
      {headerName: 'Kiểu vận chuyển', headerTooltip: 'Kiểu vận chuyển', field: 'transportType'},
      {headerName: 'Loại đơn hàng', headerTooltip: 'Loại đơn hàng', field: 'orderType'},
      {
        headerName: 'Ngày đặt', headerTooltip: 'Ngày đặt', field: 'orderDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      }
    ];
    this.fieldPartsList = [
      {headerName: 'STT', headerTooltip: 'Số thứ tự', cellRenderer: params => params.rowIndex + 1, width: 120},
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode'},
      {headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }, width: 350},
      {headerName: 'ĐVT', headerTooltip: 'Đơn vị tính', field: 'unit'},
      {headerName: 'SL Đặt', headerTooltip: 'Số lượng đặt', field: 'qty', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'SL Giao', headerTooltip: 'Số lượng giao', field: 'recvQty', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'SL Đã nhận', headerTooltip: 'Số lượng đã nhận', field: 'slDaNhan', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'SL nhận', headerTooltip: 'Số lượng nhận', field: 'recvActQty', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
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
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'rate', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'Vị trí', headerTooltip: 'Vị trí', field: 'locationno'}
    ];
  }

  ngOnInit() {
    this.loadingService.setDisplay(true);
    forkJoin([
      this.orderMethodApi.getListForManualOrder(),
      this.transportTypeApi.getAll(false)
    ]).subscribe(res => {
      this.orderMethodList = res[0];
      this.orderMethodList = this.orderMethodList.concat([
        {orderMName: 'Đặt hàng cho LSC', id: 16},
        {orderMName: 'Đặt hàng cho bán lẻ phụ tùng', id: 2},
        {orderMName: 'Đặt hàng cho lệnh hẹn', id: 1},
        {orderMName: 'Đặt hàng đặc biệt', id: 9}
      ]);

      this.transportTypeList = res[1];
      this.loadingService.setDisplay(false);
      this.buildForm();
    });
  }

  callbackManualOrder(params) {
    this.manualOrderParams = params;
  }

  getParamsManualOrder() {
    const selectedManualOrder = this.manualOrderParams.api.getSelectedRows();
    if (selectedManualOrder) {
      this.selectedManualOrder = selectedManualOrder[0];
      this.searchParts();
    }
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      orderNo: [undefined],
      transportationTypeId: [undefined],
      orderType: [undefined],
      status: [undefined],
      orderDate: [undefined]
    });
    this.searchForm.get('orderType').valueChanges.subscribe(val => this.isNonToyota = (val === 12));
  }

  callbackParts(params) {
    this.partsParams = params;
  }

  searchManualOrder(isNoneTyota) {
    const api = isNoneTyota
      ? this.partsReceiveManualApi.findNoneToyotaManualOrder(this.searchForm.value, this.paginationParams)
      : this.partsReceiveManualApi.findManualOrder(this.searchForm.value, this.paginationParams);
    this.loadingService.setDisplay(true);
    api.subscribe(val => {
      if (val) {
        this.partsList = [];
        this.partsParams.api.setRowData(this.partsList);
        this.manualOrderList = val.list;
        this.paginationTotalsData = val.total;
        this.manualOrderParams.api.setRowData(this.manualOrderList);
        if (val.list.length) {
          this.manualOrderParams.api.getModel().rowsToDisplay[0].setSelected(true);
        }
      } else {
        this.manualOrderParams.api.setRowData([]);
        this.partsParams.api.setRowData([]);
      }
      this.loadingService.setDisplay(false);
    });
  }

  changePaginationParams(paginationParams) {
    if (!this.manualOrderList) {
      return;
    }
    this.paginationParams = paginationParams;
    this.searchManualOrder(this.isNonToyota);
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  searchParts() {
    this.loadingService.setDisplay(true);
    this.partsReceiveManualApi.findPartsByManualOrder(this.selectedManualOrder.id)
      .subscribe((val: { parts: Array<PartsReceiveModel>, price: any }) => {
        if (val) {
          this.partsList = val.parts;
          this.partsParams.api.setRowData(this.partsList);
          this.price = val.price;
        }
        this.loadingService.setDisplay(false);
      });
  }


  openPartsReceiveDetailModal() {
    if (this.selectedManualOrder) {
      // const receiveParts = this.partsList.filter(part => part.qty > part.slDaNhan && part.recvQty > 0)
      const receiveParts = this.gridTableService.getAllData(this.partsParams)
        .filter(part => part.qty > part.slDaNhan && part.recvQty > 0);
      if (!receiveParts.length) {
        this.swalAlertService.openWarningToast('Không có phụ tùng để nhận');
        return;
      }
      this.partsReceiveManualDetailModal.open(this.selectedManualOrder);
    } else {
      this.swalAlertService.openWarningToast('Chọn 1 Đơn hàng để xem chi tiết', 'Bạn chưa chọn đơn hàng');
    }
  }

  formatMoney(value) {
    return this.dataFormatService.moneyFormat(value);
  }

  refresh() {
    this.searchManualOrder(this.isNonToyota);
  }
}
