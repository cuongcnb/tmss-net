import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { InvoiceModel } from '../../../../core/models/parts-management/invoice.model';
import { CommonService } from '../../../../shared/common-service/common.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { LexusOrderApi } from '../../../../api/lexus-order/lexus-order.api';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { PartsReceiveModel } from '../../../../core/models/parts-management/parts-receive.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-receive-detail-lexus',
  templateUrl: './parts-receive-detail-lexus.component.html',
  styleUrls: ['./parts-receive-detail-lexus.component.scss'],
})
export class PartsReceiveDetailLexusComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('partsReceiveDeliveryLexus', {static: false}) partsReceiveDeliveryLexus;


  @Output() refresh = new EventEmitter();
  modalHeight;
  fieldInvoiceList;
  invoiceParams;
  invoiceList: InvoiceModel[];
  selectedInvoiceNode;
  fieldPartsList;
  selectedPartsList: PartsReceiveModel[];
  selectedParts: PartsReceiveModel;
  selectedPartsIndex: number;
  partsList: PartsReceiveModel[];
  partsParams;

  constructor(private lexusOrderApi: LexusOrderApi,
              private setModalHeightService: SetModalHeightService,
              private loadingService: LoadingService,
              private commonService: CommonService,
              private gridTableService: GridTableService,
              private swalAlertService: ToastService,
              private dataFormatService: DataFormatService) {
    this.fieldInvoiceList = [
      {
        headerName: 'Số phiếu GH',
        headerTooltip: 'Số phiếu giao hàng',
        field: 'sVourcher',
      },
      {
        headerName: 'Số đơn hàng',
        headerTooltip: 'Số đơn hàng',
        field: 'orderno',
      },
      {
        headerName: 'Số Hóa đơn',
        headerTooltip: 'Số Hóa đơn',
        field: 'invoiceno',
      },
      {
        headerName: 'Ngày TMV xuất Invoice',
        headerTooltip: 'Ngày TMV xuất Invoice',
        field: 'shipdate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Ngày Nhận hàng',
        headerTooltip: 'Ngày Nhận hàng',
        field: 'modifydate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
    ];
    this.fieldPartsList = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode'
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
        width: 120
      },
      {
        headerName: 'SL Đặt',
        headerTooltip: 'Số lượng Đặt',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'qty',
      },
      {
        headerName: 'SL Giao',
        headerTooltip: 'Số lượng giao',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'recvQty',
      },
      {
        headerName: 'SL nhận',
        headerTooltip: 'Số lượng nhận',
        field: 'recvActQty',
        editable: true,
        type: 'number',
        validators: ['required', 'number', 'integerNumber'],
        cellClass: ['cell-clickable', 'cell-border', 'text-right'],
      },
      {
        headerName: 'SL Đã nhận',
        headerTooltip: 'Số lượng đã nhận',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'slDaNhan'
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        width: 250,
        field: 'sumPrice',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'rate',
      },
      {
        headerName: 'Vị trí',
        headerTooltip: 'Vị trí',
        field: 'locationno',
        editable: true,
        type: 'text',
        cellClass: ['cell-clickable', 'cell-border'],
      },
    ];
  }

  ngOnInit() {
  }

  open(invoiceList: InvoiceModel[]) {
    this.invoiceList = invoiceList;
    this.modal.show();
  }


  reset() {
    this.selectedInvoiceNode = undefined;
    this.selectedPartsList = undefined;
    this.selectedParts = undefined;
    this.selectedPartsIndex = -1;
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResizeWithoutFooter();
  }

  callbackInvoice(params) {
    this.invoiceParams = params;
    this.invoiceParams.api.setRowData(this.invoiceList);
    this.invoiceParams.api.getModel().rowsToDisplay[0].setSelected(true);
  }

  getParamsInvoice() {
    const selectedInvoiceNode = this.invoiceParams.api.getSelectedNodes();
    if (!this.selectedInvoiceNode || this.selectedInvoiceNode && selectedInvoiceNode && !this.commonService.compare(this.selectedInvoiceNode.data, selectedInvoiceNode[0].data)) {
      this.selectedInvoiceNode = selectedInvoiceNode[0];
      this.getPartsByInvoice();
    }
  }

  callbackParts(params) {
    this.partsParams = params;
  }

  getParamsParts() {
    this.selectedPartsList = this.invoiceParams.api.getSelectedRows();
  }

  cellPartsValueChange(params) {
    const data = params.data;
    if (params.colDef.field === 'recvActQty') {
      if (data.recvActQty && Number(data.recvActQty) !== 0 && Number(data.recvActQty) > Number(data.recvQty) && data.recvQty > 0) {
        data.qtyRecv = params.oldValue;
        this.swalAlertService.openWarningToast('Số lượng nhận không được lớn hơn số lượng giao', 'Số lượng nhận không đúng');
      } else {
        data.sumPrice = (Number(data.price) || 0) * (Number(data.recvActQty) || 0);
      }
    }
    params.node.setData(data);
  }

  getPartsByInvoice() {
    this.loadingService.setDisplay(true);
    this.lexusOrderApi.getLexusOrderSummaryDetail(this.selectedInvoiceNode.data.id).subscribe(data => {
      this.partsParams.api.setRowData(data.parts);
      this.loadingService.setDisplay(false);
    });
  }

  showDeliveryOrder() {
    const girdData = this.gridTableService.getAllData(this.partsParams);
    const receiveParts = girdData.filter(part => part.qty >= part.slDaNhan && part.recvActQty >= 0);
    if (!receiveParts.length) {
      this.swalAlertService.openWarningToast('Không có phụ tùng để nhận');
      return;
    }
    this.partsReceiveDeliveryLexus.open(this.selectedInvoiceNode.data, girdData);
  }

  refreshData() {
    this.invoiceList.splice(this.selectedInvoiceNode.rowIndex, 1);
    if (this.invoiceList.length) {
      this.invoiceParams.api.setRowData(this.invoiceList);
      this.invoiceParams.api.getModel().rowsToDisplay[0].setSelected(true);
    } else {
      this.modal.hide();
      this.refresh.emit();
    }
  }
}
