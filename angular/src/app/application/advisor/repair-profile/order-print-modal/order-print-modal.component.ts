import { Component, OnInit, ViewChild } from '@angular/core';
import { CashierApi } from '../../../../api/dlr-cashier/cashier.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { DownloadService } from '../../../../shared/common-service/download.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { InvCusApi } from '../../../../api/dlr-cashier/inv-cus.api';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'order-print-modal',
  templateUrl: './order-print-modal.component.html',
  styleUrls: ['./order-print-modal.component.scss'],
})
export class OrderPrintModalComponent implements OnInit {
  @ViewChild('orderPrintModal', { static: false }) orderPrintModal;
  modalHeight;
  fieldGridOrderList;
  params;
  selectedData;
  selectedOrder;

  constructor(
    private cashierApi: CashierApi,
    private invCusApi: InvCusApi,
    private loading: LoadingService,
    private downloadService: DownloadService,
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService,
    private setModalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.fieldGridOrderList = [
      { headerName: 'Hoá đơn', headerTooltip: 'Hoá đơn', field: 'invoiceNo', minWidth: 200 },
      {
        headerName: 'Ngày', headerTooltip: 'Ngày', field: 'invoiceDate', minWidth: 200,
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      { headerName: 'Thuế', headerTooltip: 'Thuế', field: 'taxRate', minWidth: 100 },
    ];
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedData) {
    this.onResize();
    this.selectedData = selectedData;
    this.orderPrintModal.show();
    this.getInvoiceByRo(this.selectedData.roId);
  }

  reset() {
    this.params.api.setRowData();
    this.selectedOrder = undefined;
    this.selectedData = undefined;
  }

  callbackOrderList(params) {
    this.params = params;
    params.api.setRowData();
  }

  getParamsOrderList() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedOrder = selectedData[0];
    }
  }

  print(parmas) {
    const isRecord = 'Y';
    this.cashierApi.printInvoice(this.selectedOrder.id, parmas.extension, isRecord).subscribe(response => {
      this.loading.setDisplay(false);
      this.downloadService.downloadFile(response);
    });
  }

  getInvoiceByRo(roId) {
    this.loading.setDisplay(true);
    this.invCusApi.getInvoiceByRo(roId).subscribe(res => {
      this.params.api.setRowData(res);
      this.gridTableService.selectFirstRow(this.params);
    });
    this.loading.setDisplay(false);
  }
}
