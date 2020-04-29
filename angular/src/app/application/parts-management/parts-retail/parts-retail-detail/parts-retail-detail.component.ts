import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PartsOfRetailOrderModel, PartsRetailDetailModel, RetailOrderModel} from '../../../../core/models/parts-management/parts-retail.model';
import {CustomerTypeApi} from '../../../../api/customer/customer-type.api';
import {BankApi} from '../../../../api/common-api/bank.api';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {PartsRetailApi} from '../../../../api/parts-management/parts-retail.api';
import {PartsInfoManagementApi} from '../../../../api/parts-management/parts-info-management.api';
import {AgDataValidateService} from '../../../../shared/ag-grid-table/ag-data-validate/ag-data-validate.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {DownloadService} from '../../../../shared/common-service/download.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-retail-detail',
  templateUrl: './parts-retail-detail.component.html',
  styleUrls: ['./parts-retail-detail.component.scss']
})
export class PartsRetailDetailComponent implements OnInit, OnChanges {
  @ViewChild('searchDataGridModal', {static: false}) searchDataGridModal;
  @ViewChild('submitDetailForm', {static: false}) submitDetailForm: ElementRef;
  @Input() orderDetailData: PartsRetailDetailModel = {customer: {}, parts: []};
  @Input() selectedOrder: RetailOrderModel;
  @Input() orderType;
  @Output() orderDetailChanged = new EventEmitter();
  @Output() newOrderCreated = new EventEmitter();
  @Output() printOrder = new EventEmitter();
  form: FormGroup;

  fieldGridPartsOfOrder;
  params;
  partsOfOrder: Array<PartsOfRetailOrderModel> = [];

  displayedParts: Array<PartsOfRetailOrderModel> = [];
  selectedPart: PartsOfRetailOrderModel;

  totalPriceBeforeTax;
  taxOnly;
  discount;
  totalPriceIncludeTax;

  constructor(
    private formBuilder: FormBuilder,
    private customerTypeApi: CustomerTypeApi,
    private bankCommonApi: BankApi,
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService,
    private partsRetailApi: PartsRetailApi,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private agDataValidateService: AgDataValidateService,
    private gridTableService: GridTableService,
    private swalAlertService: ToastService,
    private downloadService: DownloadService
  ) {
    this.fieldGridPartsOfOrder = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 25
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        width: 50
      },
      {
        headerName: 'Tên phụ tùng',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn
            ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
        }
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit',
        width: 40
      },
      {
        headerName: 'SL Tồn',
        headerTooltip: 'Số lượng Tồn',
        field: 'onHandQty',
        width: 30,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'SL ĐĐ',
        headerTooltip: 'Số lượng ĐĐ',
        field: 'ddQty',
        width: 30,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'SL Cần',
        headerTooltip: 'Số lượng Cần',
        field: 'qty',
        width: 30,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'SL ĐX',
        headerTooltip: 'Số lượng ĐX',
        field: 'dxQty',
        width: 30,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'sellPrice',
        width: 50,
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'sumPrice',
        width: 70,
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        width: 30,
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildForm();
    if (this.params) {
      this.resetForm();
    }
    if (this.orderDetailData && this.params) {
      this.fillData();
    }
  }

  ngOnInit() {
  }

  resetForm() {
    this.params.api.setRowData([]);
    this.params.api.hideOverlay();
    this.selectedPart = undefined;
    this.displayedParts = [];
  }

  // ****** AG GRID *******
  callBackGridPartsOfOrder(params) {
    this.params = params;
    if (this.orderDetailData && this.selectedOrder) {
      this.fillData();
    }
  }

  getParamsPartsOfOrder() {
    const selectedPart = this.params.api.getSelectedRows();
    if (selectedPart) {
      this.selectedPart = selectedPart[0];
    }
  }

  fillData() {
    this.form.patchValue(this.orderDetailData.customer);
    this.form.patchValue({
      salesdate: this.selectedOrder ? this.selectedOrder.salesdate : undefined
    });
    this.partsOfOrder = this.orderDetailData.parts;
    this.params.api.setRowData(this.gridTableService.addSttToData(this.orderDetailData.parts));
    this.calculateFooterDetail();
  }

  calculateFooterDetail() {
    let beforeTax = 0;
    let tax = 0;
    let taxIncluded = 0;
    let discount = 0;

    const discountPercent = this.form.getRawValue().discountPercent ? parseFloat(this.form.getRawValue().discountPercent) / 100 : 0;
    let discountEachPart = 0;

    for (const data of this.orderDetailData.parts) {
      if (!data.sumPrice) {
        break;
      } else {
        discountEachPart = discountPercent ? data.sumPrice * discountPercent
          : this.form.getRawValue().discountPrice ? parseFloat(this.form.getRawValue().discountPrice) / this.orderDetailData.parts.length : 0;
        discount += discountEachPart;
        beforeTax += data.sumPrice;
        tax += (data.sumPrice - discountEachPart) * (data.rate / 100);
        taxIncluded += (data.sumPrice - discountEachPart) + (data.sumPrice - discountEachPart) * (data.rate / 100);
      }
    }

    this.totalPriceBeforeTax = this.dataFormatService.moneyFormat(beforeTax);
    this.taxOnly = this.dataFormatService.moneyFormat(tax);
    this.discount = this.dataFormatService.moneyFormat(discount);
    this.totalPriceIncludeTax = this.dataFormatService.moneyFormat(taxIncluded);
  }

  apiCall(val, paginationParams?) {
    return this.partsInfoManagementApi.searchPartForOrder({partsCode: val || null}, paginationParams);
  }

  // ****** PRINT *******
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
      this.printOrder.emit(this.selectedOrder.id);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      orderNo: [{value: undefined, disabled: true}],
      orderType: [{value: undefined, disabled: true}],
      customerType: [{value: undefined, disabled: true}],
      mobile: [{value: undefined, disabled: true}],
      salesdate: [{value: undefined, disabled: true}],
      customerCode: [{value: undefined, disabled: true}],
      phone: [{value: undefined, disabled: true}],
      fax: [{value: undefined, disabled: true}],
      account: [{value: undefined, disabled: true}],
      customerName: [{value: undefined, disabled: true}],
      companyName: [{value: undefined, disabled: true}],
      bankName: [{value: undefined, disabled: true}],
      address: [{value: undefined, disabled: true}],
      taxNo: [{value: undefined, disabled: true}],
      discountPercent: [{value: undefined, disabled: true}],
      discountPrice: [{value: undefined, disabled: true}]
    });
  }
}
