import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PartsReceiveModel } from '../../../core/models/parts-management/parts-receive.model';
import { PartsReceiveManualApi } from '../../../api/parts-management/parts-receive-manual.api';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ManualOrderModel } from '../../../core/models/parts-management/manual-order.model';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { PaginationParamsModel } from '../../../core/models/base.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { TransportTypeApi } from '../../../api/common-api/transport-type.api';
import { OrderMethodApi } from '../../../api/common-api/order-method.api';
import { forkJoin } from 'rxjs';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { PartsReceiveManualLexusApi } from '../../../api/parts-management/parts-receive-manual-lexus.api';
import { CommonService } from '../../../shared/common-service/common.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-receive-manual-lexus',
  templateUrl: './parts-receive-manual-lexus.component.html',
  styleUrls: ['./parts-receive-manual-lexus.component.scss'],
})
export class PartsReceiveManualLexusComponent implements OnInit {
  @ViewChild('partsReceiveManualDetailLxModal', {static: false}) partsReceiveManualDetailLxModal;
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

  preTaxPrice: number;
  taxPrice: number;
  totalPrice: number;

  constructor(private formBuilder: FormBuilder,
              private partsReceiveManualApi: PartsReceiveManualApi,
              private swalAlertService: ToastService,
              private dataFormatService: DataFormatService,
              private loadingService: LoadingService,
              private transportTypeApi: TransportTypeApi,
              private orderMethodApi: OrderMethodApi,
              private partsReceiveManualLexusApi: PartsReceiveManualLexusApi,
              private commonService: CommonService,
              private gridTableService: GridTableService) {
    this.fieldManualOrderList = [
      {
        headerName: 'Số đơn hàng',
        headerTooltip: 'Số đơn hàng',
        field: 'orderno',
      },
      {
        headerName: 'Kiểu vận chuyển',
        headerTooltip: 'Kiểu vận chuyển',
        field: 'transportName',
      },
      {
        headerName: 'Loại đơn hàng',
        headerTooltip: 'Loại đơn hàng',
        field: 'orderMName',
      },
      {
        headerName: 'Ngày đặt',
        headerTooltip: 'Ngày đặt',
        field: 'orderdate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
    ];
    this.fieldPartsList = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        width: 25,
        cellClass: ['cell-readonly', 'text-center'],
        cellRenderer: params => params.rowIndex + 1,
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        width: 60,
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        },
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unitName',
        width: 30,
      },
      {
        headerName: 'SL Đặt',
        headerTooltip: 'Số lượng Đặt',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'qty',
        width: 30,
      },
      {
        headerName: 'SL Giao',
        headerTooltip: 'Số lượng Giao',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'receiveQty',
        width: 40,
      },
      {
        headerName: 'SL Đã nhận',
        headerTooltip: 'Số lượng Đã nhận',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'receivedQty',
        width: 50,
      },
      {
        headerName: 'SL nhận',
        headerTooltip: 'Số lượng nhận',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'receiveActualQty',
        width: 40,
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        width: 60,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'sumPrice',
        width: 60,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'rate',
        width: 30,
      },
      {
        headerName: 'Vị trí',
        headerTooltip: 'Vị trí',
        field: 'locationNo',
        width: 70,
      },
    ];
  }

  ngOnInit() {
    this.loadingService.setDisplay(true);
    forkJoin([
      this.orderMethodApi.getListForManualOrder(),
      this.transportTypeApi.getAll(false),
    ]).subscribe(res => {
      this.orderMethodList = res[0];
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
      fromDate: [undefined],
      toDate: [undefined],
      orderNo: [undefined],
    });
  }

  callbackParts(params) {
    this.partsParams = params;
  }

  searchManualOrder() {
    const api = this.partsReceiveManualLexusApi.partOrderInfoSearchDTO(this.searchForm.value, this.paginationParams);
    this.loadingService.setDisplay(true);
    api.subscribe(val => {
      if (val) {
        this.partsList = [];
        this.partsParams.api.setRowData(this.partsList);
        this.manualOrderList = val;
        this.paginationTotalsData = val.total;
        this.manualOrderParams.api.setRowData(this.manualOrderList);
        if (val.length) {
          this.manualOrderParams.api.getModel().rowsToDisplay[0].setSelected(true);
        }
      }
      this.loadingService.setDisplay(false);
    });
  }

  changePaginationParams(paginationParams) {
    if (!this.manualOrderList) {
      return;
    }
    this.paginationParams = paginationParams;
    this.searchManualOrder();
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  searchParts() {
    this.loadingService.setDisplay(true);
    this.partsReceiveManualLexusApi.partsDetailByManualOrder(this.selectedManualOrder.id).subscribe(val => {
      if (val) {
        this.partsList = val;
        this.partsParams.api.setRowData(val);
        // this.price = val
        this.calculate(val);
      }
      this.loadingService.setDisplay(false);
    });
  }

  calculate(val) {
    val.forEach(data => {
      Object.assign(data, {sumPrice: data.sumPrice});
    });
    const footerDetail = this.gridTableService.calculateFooterDetail(val);
    this.preTaxPrice = footerDetail.totalPriceBeforeTax;
    this.taxPrice = footerDetail.taxOnly;
    this.totalPrice = footerDetail.totalPriceIncludeTax;

  }


  openPartsReceiveDetailModal() {
    if (this.selectedManualOrder) {
      // const receiveParts = this.partsList.filter(part => part.qty > part.slDaNhan && part.recvQty > 0)
      const receiveParts = this.gridTableService.getAllData(this.partsParams).filter(part => part.qty > part.receivedQty && part.receiveQty > 0);
      if (!receiveParts.length) {
        this.swalAlertService.openWarningToast('Không có phụ tùng để nhận');
        return;
      }
      this.partsReceiveManualDetailLxModal.open(this.selectedManualOrder);
    } else {
      this.swalAlertService.openWarningToast('Chọn 1 Đơn hàng để xem chi tiết', 'Bạn chưa chọn đơn hàng');
    }
  }

  formatMoney(value) {
    return this.dataFormatService.moneyFormat(value);
  }

  refresh() {
    this.searchManualOrder();
  }
}
