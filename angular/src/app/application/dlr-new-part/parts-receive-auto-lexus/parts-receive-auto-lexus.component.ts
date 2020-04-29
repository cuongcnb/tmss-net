import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { LexusOrderApi } from '../../../api/lexus-order/lexus-order.api';
import { CommonService } from '../../../shared/common-service/common.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-receive-auto-lexus',
  templateUrl: './parts-receive-auto-lexus.component.html',
  styleUrls: ['./parts-receive-auto-lexus.component.scss'],
})
export class PartsReceiveAutoLexusComponent implements OnInit {
  @ViewChild('partsReceiveDetailLexus', {static: false}) partsReceiveDetailLexus;

  fieldGridInvoice;
  invoiceParams;
  selectedInvoice;
  selectedInvoiceList;

  fieldPartsList;
  partsParams;

  paginationTotalsData;
  paginationParams;

  constructor(
    private lexusOrderApi: LexusOrderApi,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private commonService: CommonService,
  ) {
  }

  ngOnInit() {
    this.fieldGridInvoice = [
      {
        headerName: '',
        headerTooltip: '',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 70
      },
      {headerName: 'Số phiếu GH', headerTooltip: 'Số phiếu giao hàng', field: 'sVourcher'},
      {headerName: 'Số đơn hàng ĐL gửi', headerTooltip: 'Số đơn hàng đại lý gửi', field: 'orderno'},
      {headerName: 'Số đơn hàng Lexus gửi', headerTooltip: 'Số đơn hàng Lexus gửi', field: 'tmvordNo'},
      {headerName: 'Số hóa đơn', headerTooltip: 'Số hóa đơn', field: 'invoiceno'},
      {
        headerName: 'Ngày TMV xuất Invoice',
        headerTooltip: 'Ngày TMV xuất Invoice',
        field: 'shipdate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Ngày nhận hàng',
        headerTooltip: 'Ngày nhận hàng',
        field: 'modifydate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
    ];

    this.fieldPartsList = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
        width: 30
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        width: 80
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit',
        width: 40
      },
      {
        headerName: 'SL Đặt',
        headerTooltip: 'Số lượng đặt',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'qty',
        width: 40
      },
      {
        headerName: 'SL Giao',
        headerTooltip: 'Số lượng giao',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'recvQty',
        width: 50
      },
      {
        headerName: 'SL Đã nhận',
        headerTooltip: 'Số lượng đã nhận',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'slDaNhan',
        width: 70
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        width: 60,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'sumPrice',
        width: 70,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'rate',
        width: 40
      },
      {
        headerName: 'Vị trí',
        headerTooltip: 'Vị trí',
        field: 'locationno',
        width: 100
      }
    ];
  }

  callbackInvoice(params) {
    this.invoiceParams = params;
    this.getInvoice();
  }

  getParamsInvoice() {
    this.selectedInvoiceList = this.invoiceParams.api.getSelectedRows();
  }

  rowInvoiceClicked(rowClicked) {
    if (!this.commonService.compare(this.selectedInvoice, rowClicked.data)) {
      this.selectedInvoice = rowClicked.data;
      this.getPartInvoice();
    }
  }

  rowInvoiceSelected(rowSelected) {
    if (!this.commonService.compare(this.selectedInvoice, rowSelected.data)) {
      this.selectedInvoice = rowSelected.data;
      this.getPartInvoice();
    }
  }


  resetPartPagination() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  callbackParts(params) {
    this.partsParams = params;
  }

  refresh() {
    this.getInvoice();
  }

  showDetail() {
    if (this.selectedInvoiceList && this.selectedInvoiceList.length > 0) {
      this.partsReceiveDetailLexus.open(this.selectedInvoiceList);
    } else {
      this.swalAlertService.openWarningToast('Bạn phải chọn tối thiểu một đơn hàng để nhận');
    }
  }

  private getInvoice() {
    this.loadingService.setDisplay(true);
    this.lexusOrderApi.getLexusOrderSummaryHeader().subscribe(data => {
      this.invoiceParams.api.setRowData(data);
      this.loadingService.setDisplay(false);
      if (data && data.length) {
        this.selectedInvoice = data[0];
        this.getPartInvoice();
      } else {
        this.partsParams.api.setRowData();
      }
    });
  }

  private getPartInvoice() {
    this.partsParams.api.setRowData();
    this.loadingService.setDisplay(true);
    this.lexusOrderApi.getLexusOrderSummaryDetail(this.selectedInvoice.id).subscribe(data => {
      this.partsParams.api.setRowData(data.parts);
      this.loadingService.setDisplay(false);
    });
  }
}
