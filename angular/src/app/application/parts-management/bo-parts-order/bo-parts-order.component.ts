import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {BoOrderModel} from '../../../core/models/parts-management/bo-parts-request.model';
import {BoPartsOrderApi} from '../../../api/parts-management/bo-parts-order.api';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {forkJoin} from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bo-parts-order',
  templateUrl: './bo-parts-order.component.html',
  styleUrls: ['./bo-parts-order.component.scss']
})
export class BoPartsOrderComponent implements OnInit, OnChanges {
  @ViewChild('boPartsDetailRequest', {static: false}) boPartsDetailRequest;
  @ViewChild('boRequestForm', {static: false}) boRequestForm;
  @Input() data;
  form: FormGroup;

  fieldGridOrder;
  orderParams;
  boOrderData: Array<BoOrderModel>;
  selectedOrder: BoOrderModel;
  paginationTotalsData;
  paginationParams = {
    page: 1,
    size: 20
  };

  // Footer detail
  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private boPartsOrderApi: BoPartsOrderApi,
    private gridTableService: GridTableService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data && this.form) {
      this.form.patchValue(this.data);
      this.search();
    }
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGridOrder = [
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'Số RO',
            headerTooltip: 'Số RO',
            field: 'ro',
            cellStyle: params => this.cellGroupStyle(params),
            rowGroup: true,
            hide: true,
            width: 100
          },
          {
            headerName: 'Loại',
            headerTooltip: 'Loại',
            field: 'roType',
            cellStyle: params => this.cellGroupStyle(params),
            width: 60
          },
          {
            field: 'model',
            cellStyle: params => this.cellGroupStyle(params),
            width: 60
          },
          {
            headerName: 'Người yêu cầu',
            headerTooltip: 'Người yêu cầu',
            field: 'advisorName',
            cellStyle: params => this.cellGroupStyle(params),
            width: 100
          },
          {
            headerName: 'BSX',
            headerTooltip: 'Biển số xe',
            field: 'registerNo',
            cellStyle: params => this.cellGroupStyle(params),
            width: 80
          },
          {
            headerName: 'Ngày yêu cầu',
            headerTooltip: 'Ngày yêu cầu',
            field: 'requestDate',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
            valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
            cellStyle: params => this.cellGroupStyle(params),
            width: 120
          },
          {
            headerName: 'Mã PT',
            headerTooltip: 'Mã phụ tùng',
            field: 'partsCode',
            cellStyle: params => this.cellGroupStyle(params),
            width: 100
          },
          {
            headerName: 'Tên PT',
            headerTooltip: 'Tên phụ tùng',
            field: 'partsName',
            cellStyle: params => this.cellGroupStyle(params),
            width: 140
          }
        ]
      },
      {
        headerName: 'Stock at TMV',
        headerTooltip: 'Stock at TMV',
        children: [
          {
            headerName: 'SPD',
            headerTooltip: 'SPD',
            field: 'spd',
            cellStyle: params => this.cellGroupStyle(params),
            width: 40
          },
          {
            headerName: 'CPD',
            headerTooltip: 'CPD',
            field: 'cpd',
            cellStyle: params => this.cellGroupStyle(params),
            width: 40
          }
        ]
      },
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        children: [
          {
            headerName: 'Cần',
            headerTooltip: 'Cần',
            field: 'qty',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            cellStyle: params => this.cellGroupStyle(params),
            width: 50
          },
          {
            headerName: 'Đã đặt',
            headerTooltip: 'Đã đặt',
            field: 'orderQty',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            cellStyle: params => this.cellGroupStyle(params),
            width: 50
          }
        ]
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'ĐVT',
            headerTooltip: 'Đơn vị tính',
            field: 'unit',
            cellStyle: params => this.cellGroupStyle(params),
            width: 50
          },
          {
            headerName: 'Đơn giá',
            headerTooltip: 'Đơn giá',
            field: 'price',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            cellStyle: params => this.cellGroupStyle(params),
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
            width: 70
          },
          {
            headerName: 'Thành Tiền',
            headerTooltip: 'Thành Tiền',
            field: 'sumPrice',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            cellStyle: params => this.cellGroupStyle(params),
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
            width: 80
          },
          {
            headerName: 'Thuế',
            headerTooltip: 'Thuế',
            field: 'rate',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            cellStyle: params => this.cellGroupStyle(params),
            width: 40
          },
          {
            headerName: 'Tên KH',
            headerTooltip: 'Tên khách hàng',
            field: 'customerName',
            cellStyle: params => this.cellGroupStyle(params),
            width: 100
          },
          {
            headerName: 'Địa chỉ',
            headerTooltip: 'Địa chỉ',
            field: 'customerAddress',
            cellStyle: params => this.cellGroupStyle(params),
            width: 250
          }
        ]
      }
    ];
  }

  private cellGroupStyle(params) {
    if (params.node.group) {
      return {backgroundColor: '#7be8e8 !important', color: '#000'};
    }
  }

  // =====**** ORDER GRID ****=====
  callbackRequest(params) {
    this.orderParams = params;
    // this.search();
  }

  getParamsRequest() {
    const selectedOrder = this.orderParams.api.getSelectedRows();
    if (selectedOrder) {
      this.selectedOrder = selectedOrder[0];
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.boOrderData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams = null;
      this.paginationParams = {
        page: 1,
        size: 20
      };
    }
    this.paginationTotalsData = 0;
  }

  search() {
    if (!this.form.get('registerNo').value || this.form.get('registerNo').value.length == 0) {
      this.form.get('registerNo').setValue(null);
    }
    // Search order and count in different APIs
    this.loadingService.setDisplay(true);
    forkJoin([
      this.boPartsOrderApi.searchBoPart(this.form.value, this.paginationParams),
      this.boPartsOrderApi.getCount(this.form.value, this.paginationParams)
    ]).subscribe((res: Array<any>) => {
      this.loadingService.setDisplay(false);
      this.boOrderData = res[0] ? res[0] : [];
      this.paginationTotalsData = res[1];
      this.selectedOrder = undefined;
      if (this.orderParams) {
        this.orderParams.api.setRowData(this.gridTableService.addSttToData(this.boOrderData, this.paginationParams));
      }
      this.calculateFooterDetail();
      this.gridTableService.expandAllRows(this.orderParams);
    });
    this.verifyRegisterNo();
  }

  refreshAfterOrder(orderSuccessful) {
    if (orderSuccessful) {
      this.search();
    }
  }

  placeOrder() {
    if (!this.selectedOrder) {
      this.swalAlertService.openWarningToast('Chưa chọn đơn hàng, bạn hãy chọn một đơn hàng để đặt hàng');
    } else if (!this.selectedOrder) {
      this.swalAlertService.openWarningToast('Đơn hàng không có phụ tùng, hãy chọn đơn hàng khác để đặt hàng');
    } else {
      // Open modal and send selectedOrder
      this.selectedOrder.reqtype = this.form.get('type').value;
      this.boPartsDetailRequest.open(this.selectedOrder);
    }
  }

  calculateFooterDetail() {
    const footerDetail = this.gridTableService.calculateFooterDetail(this.boOrderData);
    this.totalPriceBeforeTax = footerDetail.totalPriceBeforeTax;
    this.taxOnly = footerDetail.taxOnly;
    this.totalPriceIncludeTax = footerDetail.totalPriceIncludeTax;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      type: [0],
      ro: [undefined],
      registerNo: [null] 
    });
    if (this.data && this.data.ro) {
      this.form.patchValue(this.data);
      this.search();
    }
  }

  verifyRegisterNo() {
    const control = this.form.get('registerNo');
    if (control.value) {
      control.setValue(control.value.split(/[^A-Za-z0-9]/).join('').toUpperCase());
    }
  }

  checkType() {
    let type = this.form.get('type').value;
    let registerNoField = this.form.get('registerNo');
    if (type == 1) {
      registerNoField.setValue(null);
      registerNoField.disable();
    } else {
      registerNoField.enable();
    }
  }
}
