import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { InvCusApi } from '../../../../api/dlr-cashier/inv-cus.api';
import { InvCusDApi } from '../../../../api/dlr-cashier/inv-cus-d.api';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cashier-detail',
  templateUrl: './cashier-detail.component.html',
  styleUrls: ['./cashier-detail.component.scss']
})
export class CashierDetailComponent implements OnInit {
  @Output() invoiceCusId = new EventEmitter();
  contractGridField;
  contractParams;
  contractSelected;

  contractDetailGridField;
  contractDetailParams;

  constructor(
    private loading: LoadingService,
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService,
    private invCusApi: InvCusApi,
    private invCusDApi: InvCusDApi,
  ) {
  }

  ngOnInit() {
    this.contractGridField = [
      {
        headerName: 'Ngày hợp đồng',
        headerTooltip: 'Ngày hợp đồng',
        field: 'invoiceDate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        minWidth: 100
      },
      {headerName: 'Số HD', headerTooltip: 'Số HD', field: 'invoiceNo', minWidth: 100},
      {headerName: 'Khách hàng', headerTooltip: 'Khách hàng', field: 'cusName', minWidth: 100},
      {headerName: 'Mã số thuế', headerTooltip: 'Mã số thuế', field: 'taxCode', minWidth: 70},
      {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'cusAdd', minWidth: 150},
      {headerName: 'Số ĐT', headerTooltip: 'Số ĐT', field: 'cusTel', minWidth: 70, cellClass: ['cell-border', 'text-right']},
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'taxRate', minWidth: 70, cellClass: ['cell-border', 'text-right']},
      {headerName: 'In hóa đơn', headerTooltip: 'In hóa đơn', field: 'printInvoice', minWidth: 100}
    ];

    this.contractDetailGridField = [
      {headerName: 'Nội dung', headerTooltip: 'Nội dung', field: 'nameGoods'},
      {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'qty', width: 50, cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {
        headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'price', width: 60,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.formatMoney(params.value),
        valueFormatter: params => this.dataFormatService.formatMoney(params.value)
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        width: 70,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.formatMoney(Math.round(params.data.qty * params.data.price)),
        valueFormatter: params => this.dataFormatService.formatMoney(Math.round(params.data.qty * params.data.price))
      }
    ];
  }

  callbackContract(params) {
    this.contractParams = params;
  }

  getParamsContract() {
    const selectedData = this.contractParams.api.getSelectedRows();
    if (selectedData) {
      this.contractSelected = selectedData[0];
      this.invoiceCusId.emit(this.contractSelected.id);
      this.getInvoiceDetail(this.contractSelected.id);
    }
  }

  callbackContractDetail(params) {
    this.contractDetailParams = params;
  }

  getInvoice(cashierId) {
    if (this.contractDetailParams) { this.contractDetailParams.api.setRowData(); }
    this.loading.setDisplay(true);
    this.invCusApi.getInvoiceByCashier(cashierId).subscribe(res => {
      if (res) {
        this.contractParams.api.setRowData(res);
        this.gridTableService.selectFirstRow(this.contractParams);
      } else {
        this.contractParams.api.setRowData();
        this.contractSelected = undefined;
      }
      this.loading.setDisplay(false);
    });
  }

  private getInvoiceDetail(invCusId) {
    this.loading.setDisplay(true);
    this.invCusDApi.getInvoiceDetail(invCusId).subscribe(res => {
      !!res ? this.contractDetailParams.api.setRowData(res) : this.contractDetailParams.api.setRowData();
      this.loading.setDisplay(false);
    });
  }
}
