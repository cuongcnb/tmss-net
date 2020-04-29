import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { PartsExportApi } from '../../../../api/parts-management/parts-export.api';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { PartsExportCustomerInfo, PartsExportPartOfRo } from '../../../../core/models/parts-management/parts-export.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-export-view-slip-modal',
  templateUrl: './parts-export-view-slip-modal.component.html',
  styleUrls: ['./parts-export-view-slip-modal.component.scss'],
})
export class PartsExportViewSlipModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('partsExportSingleSlipModal', {static: false}) partsExportSingleSlipModal;
  @ViewChild('partSelectPrintFormatModal', {static: false}) partSelectPrintFormatModal;
  modalHeight: number;
  form: FormGroup;

  exportedParts: Array<PartsExportPartOfRo>;
  customerInfo: PartsExportCustomerInfo;

  fieldGrid;
  params;

  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  exportTypeArr = [
    { key: 0, value: 'Lệnh sửa chữa' },
    { key: 1, value: 'Bán lẻ phụ tùng' },
    { key: 2, value: 'Đặt hẹn' },
  ];

  constructor(
    private loadingService: LoadingService,
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private partsExportApi: PartsExportApi,
    private gridTableService: GridTableService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 80,
        cellRenderer: params => params.rowIndex + 1
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
        headerName: 'SL Xuất',
        headerTooltip: 'Số lượng Xuất',
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
    ];
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  getExportedParts() {
    this.loadingService.setDisplay(true);
    this.partsExportApi.viewAllExport(this.customerInfo.reqId, this.customerInfo.reqtype).subscribe(exportedParts => {
      this.loadingService.setDisplay(false);
      this.exportedParts = exportedParts;
      this.params.api.setRowData(this.exportedParts);
      this.calculateFooterDetail();
    });
    // Đổi thành api khi backend làm xong api
    // this.params.api.setRowData(this.exportedParts);
  }

  open(customerInfo) {
    this.modal.show();
    this.buildForm();
    this.customerInfo = customerInfo;
    this.form.patchValue(this.customerInfo);
  }

  reset() {
    this.form = undefined;
  }

  callBackGrid(params) {
    this.params = params;
    this.getExportedParts();
  }

  viewExportTimes() {
    this.partsExportSingleSlipModal.open(this.customerInfo);
  }

  printSlip() {
    this.partSelectPrintFormatModal.open(this.customerInfo, this.exportedParts);
  }

  calculateFooterDetail() {
    const footerDetail = this.gridTableService.calculateFooterDetail(this.exportedParts);
    this.totalPriceBeforeTax = footerDetail.totalPriceBeforeTax;
    this.taxOnly = footerDetail.taxOnly;
    this.totalPriceIncludeTax = footerDetail.totalPriceIncludeTax;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      reqtype: [{ value: undefined, disabled: true }],
      ro: [{ value: undefined, disabled: true }],
      plate: [{ value: undefined, disabled: true }],
      customerName: [{ value: undefined, disabled: true }],
      model: [{ value: undefined, disabled: true }],
      taxNo: [{ value: undefined, disabled: true }],
      advisor: [{ value: undefined, disabled: true }],
      address: [{ value: undefined, disabled: true }],
    });
  }

}
