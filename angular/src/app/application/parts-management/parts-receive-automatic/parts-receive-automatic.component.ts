import {Component, OnInit, ViewChild} from '@angular/core';

import {PartsReceiveAutomaticApi} from '../../../api/parts-management/parts-receive-automatic.api';
import {InvoiceModel} from '../../../core/models/parts-management/invoice.model';
import {PartsReceiveModel} from '../../../core/models/parts-management/parts-receive.model';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {CommonService} from '../../../shared/common-service/common.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {AgCheckboxRendererComponent} from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-receive-automatic',
  templateUrl: './parts-receive-automatic.component.html',
  styleUrls: ['./parts-receive-automatic.component.scss']
})
export class PartsReceiveAutomaticComponent implements OnInit {
  @ViewChild('partsReceiveDetailModal', {static: false}) partsReceiveDetailModal;

  fieldInvoiceList;
  invoiceParams;
  invoiceList: InvoiceModel[];
  selectedInvoice;
  selectedInvoiceList;

  fieldPartsList;
  partsList: PartsReceiveModel[];
  partsParams;
  paginationTotalsData;
  paginationParams;
  frameworkComponents;

  constructor(private partsReceiveAutomaticApi: PartsReceiveAutomaticApi,
              private swalAlertService: ToastService,
              private loadingService: LoadingService,
              private commonService: CommonService,
              private dataFormatService: DataFormatService) {
    this.fieldInvoiceList = [
      {
        headerName: '',
        headerTooltip: '',
        field: 'checkForExport',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 30
      },
      {
        headerName: 'Số phiếu GH',
        headerTooltip: 'Số phiếu giao hàng',
        field: 'svourcher'
      },
      {
        headerName: 'Số đơn hàng',
        headerTooltip: 'Số đơn hàng',
        field: 'orderNo'
      },
      {
        headerName: 'Số Hóa đơn',
        headerTooltip: 'Số Hóa đơn',
        field: 'invoiceNo'
      },
      {
        headerName: 'Ngày TMV xuất Invoice',
        headerTooltip: 'Ngày TMV xuất Invoice',
        field: 'shipdate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'Ngày Nhận hàng',
        headerTooltip: 'Ngày Nhận hàng',
        field: 'modifydate'
      }
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
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent
    };

  }

  ngOnInit() {
  }

  callbackInvoice(params) {
    this.invoiceParams = params;
    this.getInvoice();
  }

  onCellClicked(params) {
    this.selectedInvoice = params.data;
    this.getPartsByInvoice();
  }

  getParamsInvoice() {
    this.selectedInvoiceList = this.invoiceParams.api.getSelectedRows();
    if (this.selectedInvoiceList) {
      this.selectedInvoice = this.selectedInvoiceList[0];
      if (!this.selectedInvoice) {
        this.swalAlertService.openWarningToast('Ít nhất một dòng phải được chọn.');
        this.partsParams.api.setRowData([]);
        return;
      }
      this.getPartsByInvoice();
    }
  }

  agKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    const focusCell = this.invoiceParams.api.getFocusedCell();
    this.selectedInvoice = this.invoiceParams.api.getRowNode(focusCell.rowIndex).data;
    this.getPartsByInvoice();
  }

  getInvoice() {
    this.loadingService.setDisplay(true);
    this.partsReceiveAutomaticApi.getInvoices({
      fieldSort: null,
      filters: null,
      orderNo: null,
      sortType: null
    }, this.paginationParams)
      .subscribe(val => {
          this.loadingService.setDisplay(false);
          if (val && val.list && val.list.length > 0) {
            this.paginationTotalsData = val.total;
            this.invoiceList = val.list;
            this.invoiceParams.api.setRowData(val.list);
            this.invoiceParams.api.setFocusedCell(0, 'orderNo');
            this.selectedInvoice = this.invoiceList[0];
            this.getPartsByInvoice();
            // this.invoiceParams.api.getModel().rowsToDisplay[0].setSelected(true);
          } else {
            this.invoiceParams.api.setRowData([]);
            this.partsParams.api.setRowData([]);
          }
        }
      );
  }


  callbackParts(params) {
    this.partsParams = params;
  }

  getPartsByInvoice() {
    this.loadingService.setDisplay(true);
    this.partsReceiveAutomaticApi.getPartByInvoice(this.selectedInvoice.id).subscribe((val: { parts: PartsReceiveModel[] }) => {
        if (val && val.parts && val.parts.length) {
          this.partsList = val.parts;
          this.partsParams.api.setRowData(this.partsList);
          this.partsParams.api.getModel().rowsToDisplay[0].setSelected(true);
        }
        this.loadingService.setDisplay(false);
      }
    );
  }

  showDetail() {
    if (this.selectedInvoiceList && this.selectedInvoiceList.length > 0) {
      this.partsReceiveDetailModal.open(this.selectedInvoiceList);
    } else {
      this.swalAlertService.openWarningToast('Bạn phải chọn tối thiểu một đơn hàng để nhận');
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.invoiceList) {
      return;
    }
    this.paginationParams = paginationParams;
    this.getInvoice();
  }

  resetPartPagination() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  refresh() {
    this.getInvoice();
  }
}
