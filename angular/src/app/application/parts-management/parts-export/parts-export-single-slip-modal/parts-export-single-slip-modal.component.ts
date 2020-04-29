import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { PartsExportCustomerInfo, PartsExportPartOfRo } from '../../../../core/models/parts-management/parts-export.model';
import { PartsExportApi } from '../../../../api/parts-management/parts-export.api';
import { LoadingService } from '../../../../shared/loading/loading.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-export-single-slip-modal',
  templateUrl: './parts-export-single-slip-modal.component.html',
  styleUrls: ['./parts-export-single-slip-modal.component.scss']
})
export class PartsExportSingleSlipModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('partSelectPrintFormatModal', {static: false}) partSelectPrintFormatModal;
  modalHeight: number;
  form: FormGroup;
  partList: Array<PartsExportPartOfRo>;
  customerInfo: PartsExportCustomerInfo;
  fieldGrid;
  params;

  numberOfShipping = []; // Số lần xuất

  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  exportTypeArr = [
    {key: 0, value: 'Lệnh sửa chữa'},
    {key: 1, value: 'Bán lẻ phụ tùng'},
    {key: 2, value: 'Đặt hẹn'},
  ];

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private gridTableService: GridTableService,
    private partsExportApi: PartsExportApi,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 80,
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
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
        field: 'unit',
      },
      {
        headerName: 'Xuất',
        headerTooltip: 'Xuất',
        field: 'qty',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'sellprice',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.formatMoney(params.value),
        valueFormatter: params => this.dataFormatService.formatMoney(params.value),
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'sumPrice',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.formatMoney(params.value),
        valueFormatter: params => this.dataFormatService.formatMoney(params.value),
      },
      {
        headerName: 'Thuế (%)',
        headerTooltip: 'Thuế (%)',
        field: 'rate',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
      },
      {
        headerName: 'Vị trí',
        headerTooltip: 'Vị trí',
        field: 'locationno',
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'shippingStatusName',
      }
    ];
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  getNumberOfShipping(reqId, requestType) {
    this.loadingService.setDisplay(true);
    this.partsExportApi.getNumberOfShipping(reqId, requestType).subscribe(res => {
      this.loadingService.setDisplay(false);
      for (let i = 1; i <= res; i++) {
        this.numberOfShipping.push(i);
      }
      this.form.patchValue({
        shippingNumber: this.numberOfShipping[this.numberOfShipping.length - 1]
      });
    });
  }

  getExportDetail(val?) {
    this.loadingService.setDisplay(true);
    this.partsExportApi
      .viewSingleExport(this.customerInfo.reqId, this.customerInfo.reqtype,
        val ? val : this.form.value.shippingNumber)
      .subscribe(partList => {
        this.loadingService.setDisplay(false);
        this.partList = partList;
        this.params.api.setRowData(this.gridTableService.addSttToData(partList));
        this.calculateFooterDetail(partList);
      });
  }

  open(customerInfo) {
    this.modal.show();
    this.buildForm();
    this.customerInfo = customerInfo;
    this.getNumberOfShipping(this.customerInfo.reqId, this.customerInfo.reqtype);
    this.form.patchValue(this.customerInfo);
  }

  reset() {
    this.form = undefined;
    this.numberOfShipping = [];
    this.customerInfo = undefined;
  }

  callBackGrid(params) {
    this.params = params;
    this.getSingleSlip();
  }

  getSingleSlip() {
    // API
    // this.calculateFooterDetail();
  }

  printSlip() {
    this.partSelectPrintFormatModal.open(this.customerInfo, this.partList, this.form.value.shippingNumber);
  }

  calculateFooterDetail(displayedPart) {
    const footerDetail = this.gridTableService.calculateFooterDetail(displayedPart);
    this.totalPriceBeforeTax = footerDetail.totalPriceBeforeTax;
    this.taxOnly = footerDetail.taxOnly;
    this.totalPriceIncludeTax = footerDetail.totalPriceIncludeTax;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      reqtype: [{value: undefined, disabled: true}],
      ro: [{value: undefined, disabled: true}],
      plate: [{value: undefined, disabled: true}],
      customerName: [{value: undefined, disabled: true}],
      model: [{value: undefined, disabled: true}],
      taxNo: [{value: undefined, disabled: true}],
      advisor: [{value: undefined, disabled: true}],
      address: [{value: undefined, disabled: true}],
      shippingNumber: [{value: undefined, disabled: false}],
    });
    this.form.get('shippingNumber').valueChanges.subscribe(val => {
      if (val) {
        this.getExportDetail(val);
      }
    });
  }

}
