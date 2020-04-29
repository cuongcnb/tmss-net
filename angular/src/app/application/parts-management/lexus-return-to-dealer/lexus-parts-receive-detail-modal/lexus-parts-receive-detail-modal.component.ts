import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {InvoiceModel} from '../../../../core/models/parts-management/invoice.model';
import {LexusReturnToDealerApi} from '../../../../api/parts-management/lexus-return-to-dealer.api';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {PartsReceiveModel} from '../../../../core/models/parts-management/parts-receive.model';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {CommonService} from '../../../../shared/common-service/common.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lexus-parts-receive-detail-modal',
  templateUrl: './lexus-parts-receive-detail-modal.component.html',
  styleUrls: ['./lexus-parts-receive-detail-modal.component.scss']
})
export class LexusPartsReceiveDetailModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('deliveryOrderModal', {static: false}) deliveryOrderModal;
  @ViewChild('cellTableEditModal', {static: false}) cellTableEditModal;
  @ViewChild('partGridTable', {static: false}) partGridTable;
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
  startEditing;

  constructor(private lexusReturnToDealerApi: LexusReturnToDealerApi,
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
        field: 'svourcher'
      },
      {
        headerName: 'Số đơn hàng Lexus gửi',
        headerTooltip: 'Số đơn hàng Lexus gửi',
        field: 'orderNo'
      },
      {
        headerName: 'Số đơn hàng ĐL gửi',
        headerTooltip: 'Số đơn hàng đại lý gửi',
        field: 'lexordNo'
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
        field: 'modifydate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      }
    ];
    this.fieldPartsList = [
      {
        headerName: '',
        headerTooltip: '',
        field: 'checkbox',
        checkboxSelection: true,
        width: 100
      },
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
        width: 120
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        width: 300
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        width: 450,
        valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
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
        headerTooltip: 'Số lượng đặt',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'qty'
      },
      {
        headerName: 'SL Giao',
        headerTooltip: 'Số lượng Giao',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'recvQty'
      },
      {
        headerName: 'SL đã nhận',
        headerTooltip: 'Số lượng đã nhận',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'slDaNhan'
      },
      {
        headerName: 'SL trả ĐL',
        headerTooltip: 'Số lượng trả đại lý',
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
        field: 'rate'
      },
      {
        headerName: 'Vị trí',
        headerTooltip: 'Vị trí',
        field: 'locationno',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
      }
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
      if (!data.recvActQty) {
        this.swalAlertService.openWarningToast('Số lượng nhận không được để trống', 'Số lượng nhận không đúng');
        this.partGridTable.focusAfterEdit(params);
        return;
      }

      if (data.recvActQty && data.recvQty >= 0 && Number(data.recvActQty) !== 0 && Number(data.recvActQty) > Number(data.recvQty)) {
        this.swalAlertService.openWarningToast('Số lượng nhận không được lớn hơn số lượng giao', 'Số lượng nhận không đúng');
        this.partGridTable.focusAfterEdit(params);
        return;
      }

      data.sumPrice = (Number(data.price) || 0) * (Number(data.recvActQty) || 0);
    }
    params.node.setData(data);
  }

  cellEditingStarted() {
    this.startEditing = true;
  }

  cellEditingStopped() {
    setTimeout(() => {
      this.startEditing = false;
    }, 500);
  }

  getPartsByInvoice() {
    this.loadingService.setDisplay(true);
    this.lexusReturnToDealerApi.getPartByInvoice(this.selectedInvoiceNode.data.id).subscribe((val: { parts: PartsReceiveModel[] }) => {
      if (val) {
        this.partsList = val.parts.map(item => {
          item.recvActQty = item.recvQty - item.slDaNhan;
          item.sumPrice = (Number(item.price) || 0) * (Number(item.recvActQty) || 0);
          return item;
        });
        this.partsParams.api.setRowData(this.partsList);
      }
      this.loadingService.setDisplay(false);
    });
  }

  showDeliveryOrder() {
    const girdData = this.gridTableService.getAllData(this.partsParams);
    const receiveParts = girdData.filter(part => part.qty > part.slDaNhan && part.recvQty >= 0 && part.recvActQty >= 0);
    if ((!receiveParts.length || receiveParts.length < girdData.length) && this.selectedInvoiceNode && this.selectedInvoiceNode.data.svourcher.indexOf('R') < 0) {
      this.swalAlertService.openWarningToast('Không có phụ tùng để nhận');
      return;
    }
    const data = girdData.find(it => it.recvActQty && it.recvQty && Number(it.recvActQty) !== 0 && Number(it.recvActQty) > Number(it.recvQty));
    if (data) {
      this.swalAlertService.openWarningToast('Số lượng nhận không thể lớn hơn số lượng giao');
      return;
    }
    this.deliveryOrderModal.open(this.selectedInvoiceNode.data, girdData);
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
