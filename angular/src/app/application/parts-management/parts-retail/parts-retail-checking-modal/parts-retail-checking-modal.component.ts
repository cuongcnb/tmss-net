import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import {
  CustomerOfRetailOrderModel,
  PartsOfRetailOrderModel,
  RetailOrderModel
} from '../../../../core/models/parts-management/parts-retail.model';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerTypeModel } from '../../../../core/models/common-models/customer-type-model';
import { BankModel } from '../../../../core/models/common-models/bank-model';
import { PartsRetailApi } from '../../../../api/parts-management/parts-retail.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-retail-checking-modal',
  templateUrl: './parts-retail-checking-modal.component.html',
  styleUrls: ['./parts-retail-checking-modal.component.scss']
})
export class PartsRetailCheckingModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  form: FormGroup;

  @Input() customerTypeArr: CustomerTypeModel[] = [];
  @Input() bankArr: BankModel[] = [];

  selectedOrder: RetailOrderModel;
  displayedData: PartsOfRetailOrderModel[];
  customerDetail: CustomerOfRetailOrderModel;

  fieldGrid;
  params;

  totalPriceBeforeTax;
  taxOnly;
  discount;
  totalPriceIncludeTax;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private partsRetailApi: PartsRetailApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
  ) {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName:     'STT',
        headerTooltip:  'Số thứ tự',
        field:          'stt',
        width:          25,
      },
      {
        headerName:     'Mã PT',
        headerTooltip:  'Mã phụ tùng',
        field:          'partsCode',
        width:          60,
      },
      {
        headerName:     'Tên phụ tùng',
        headerTooltip:  'Tên phụ tùng',
        field:          'partsNameVn',
      },
      {
        headerName:     'ĐVT',
        headerTooltip:  'Đơn vị tính',
        field:          'unit',
        width:          40,
      },
      {
        headerName:     'SL Tồn',
        headerTooltip:  'Số lượng tồn',
        field:          'onHandQty',
        width:          40,
        cellClass:      ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
      },
      {
        headerName:     'SL ĐĐ',
        headerTooltip:  'Số lượng ĐĐ',
        field:          'ddQty',
        width:          40,
        cellClass:      ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
      },
      {
        headerName:     'SL Cần',
        headerTooltip:  'Số lượng cần',
        field:          'qty',
        width:          40,
        cellClass:      ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
      },
      {
        headerName:     'SL ĐX',
        headerTooltip:  'Số lượng ĐX',
        field:          'dxQty',
        width:          40,
        cellClass:      ['cell-border', 'cell-readonly', 'text-right'],
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
      },
      {
        headerName:     'Đơn giá',
        headerTooltip:  'Đơn giá',
        field:          'sellPrice',
        width:          50,
        cellClass:      ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
      },
      {
        headerName:     'Thành tiền',
        headerTooltip:  'Thành tiền',
        field:          'sumPrice',
        width:          80,
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass:      ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName:     'Thuế',
        headerTooltip:  'Thuế',
        field:          'rate',
        width:          30,
        cellClass:      ['cell-border', 'cell-readonly', 'text-right']
      }
    ];
  }

  open(selectedOrder, displayedData, customerDetail) {
    this.modal.show();
    this.buildForm();
    this.patchData(selectedOrder, displayedData, customerDetail);
  }

  patchData(selectedOrder, displayedData, customerDetail) {
    this.selectedOrder = selectedOrder;
    this.displayedData = displayedData;
    this.customerDetail = customerDetail;
    if (displayedData && customerDetail) {
      this.form.patchValue(this.customerDetail);
      setTimeout(() => {
        this.params.api.setRowData(this.displayedData);
        this.calculateFooterDetail();
      }, 300);
    }
  }

  reset() {
    this.form = undefined;
    this.selectedOrder = undefined;
  }

  callBackGrid(params) {
    this.params = params;
  }

  placeOrder() {
    const orderDetail = Object.assign(this.form.getRawValue(), {
      parts: this.displayedData,
      id: this.selectedOrder ? this.selectedOrder.id : null
    });
    const apiCall = this.selectedOrder ? this.partsRetailApi.updateOrder(orderDetail) : this.partsRetailApi.create(orderDetail);
    this.loadingService.setDisplay(true);
    apiCall.subscribe(res => {
      this.loadingService.setDisplay(false);
      this.modal.hide();
      this.close.emit(res);
      this.swalAlertService.openSuccessToast(`${this.selectedOrder ? 'Cập nhật thành công đơn hàng: ' : 'Tạo mới thành công đơn hàng: '} ${res.ctno}`);
    });
  }

  calculateFooterDetail() {
    let beforeTax = 0;
    let tax = 0;
    let taxIncluded = 0;
    let discount = 0;

    const formValue = this.form.getRawValue();

    const discountPercent = formValue.discountPercent ? parseFloat(formValue.discountPercent) / 100 : 0;
    let discountEachPart = 0;

    for (const data of this.displayedData) {
      if (!data.sumPrice) {
        break;
      } else {
        discountEachPart = discountPercent ? data.sumPrice * discountPercent
          : formValue.discountPrice ? parseFloat(formValue.discountPrice) / this.displayedData.length : 0;
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

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      orderNo: [{ value: undefined, disabled: true }],
      orderType: [{ value: undefined, disabled: true }],
      customerTypeId: [{ value: undefined, disabled: true }],
      mobile: [{ value: undefined, disabled: true }],
      salesdate: [{ value: undefined, disabled: true }],
      customerCode: [{ value: undefined, disabled: true }],
      customerId: [{ value: undefined, disabled: true }],
      phone: [{ value: undefined, disabled: true }],
      fax: [{ value: undefined, disabled: true }],
      account: [{ value: undefined, disabled: true }],
      customerName: [{ value: undefined, disabled: true }],
      companyName: [{ value: undefined, disabled: true }],
      bankId: [{ value: undefined, disabled: true }],
      address: [{ value: undefined, disabled: true }],
      taxNo: [{ value: undefined, disabled: true }],
      discountPercent: [{ value: undefined, disabled: true }],
      discountPrice: [{ value: undefined, disabled: true }],
    });
  }

}
