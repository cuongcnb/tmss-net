import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {PartsReceiveModel} from '../../../../core/models/parts-management/parts-receive.model';
import {ManualOrderModel} from '../../../../core/models/parts-management/manual-order.model';
import {ModalDirective} from 'ngx-bootstrap';
import {PartsReceiveManualApi} from '../../../../api/parts-management/parts-receive-manual.api';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {CommonService} from '../../../../shared/common-service/common.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {PartsReceiveManualLexusApi} from '../../../../api/parts-management/parts-receive-manual-lexus.api';
import {ServiceReportApi} from '../../../../api/service-report/service-report.api';
import {DownloadService} from '../../../../shared/common-service/download.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-receive-manual-detail-lx-modal',
  templateUrl: './parts-receive-manual-detail-lx-modal.component.html',
  styleUrls: ['./parts-receive-manual-detail-lx-modal.component.scss']
})
export class PartsReceiveManualDetailLxModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('cellTableEditModal', {static: false}) cellTableEditModal;
  @ViewChild('gridTable', {static: false}) gridTable;
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;
  @Output() receive = new EventEmitter();
  manualOrder;
  fieldPartsList;
  partsList: PartsReceiveModel[];
  partsParams;
  modalHeight;
  manualPartsForm: FormGroup;
  totalPartsBeforeTax;
  totalTax;
  totalPartsAfterTax;
  startEditing;

  constructor(private partsReceiveManualApi: PartsReceiveManualApi,
              private setModalHeightService: SetModalHeightService,
              private commonService: CommonService,
              private swalAlertService: ToastService,
              private formBuilder: FormBuilder,
              private dataFormatService: DataFormatService,
              private loadingService: LoadingService,
              private gridTableService: GridTableService,
              private partsReceiveManualLexusApi: PartsReceiveManualLexusApi,
              private serviceReportApi: ServiceReportApi,
              private downloadService: DownloadService
  ) {
    this.fieldPartsList = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        width: 20,
        cellClass: ['cell-readonly', 'text-center'],
        cellRenderer: params => params.rowIndex + 1
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        width: 50
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
        width: 30
      },
      {
        headerName: 'SL Đặt',
        headerTooltip: 'Số lượng Đặt',
        field: 'qty',
        width: 30,
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'SL Giao',
        headerTooltip: 'Số lượng Giao',
        field: 'recvQty',
        width: 40,
        cellClass: ['cell-border', 'cell-clickable', 'text-right'],
        validators: ['number', 'positiveNumber'],
        editable: true
      },
      {
        headerName: 'SL nhận',
        headerTooltip: 'Số lượng nhận',
        field: 'recvActQty',
        width: 40,
        cellClass: ['cell-border', 'cell-clickable', 'text-right'],
        validators: ['number', 'notNagetiveIntNumber'],
        editable: true
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
        width: 60,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        width: 30,
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'Vị trí',
        headerTooltip: 'Vị trí',
        field: 'locationNo',
        width: 80,
        cellClass: ['cell-clickable', 'cell-border'],
        editable: true
      }
    ];
  }

  ngOnInit() {
  }

  open(manualOrder: ManualOrderModel) {
    this.manualOrder = manualOrder;
    this.buildForm(this.manualOrder);
    this.modal.show();
  }

  reset() {
    this.manualOrder = null;
    this.partsList = null;
    this.manualPartsForm = null;
  }

  buildForm(val?) {
    this.manualPartsForm = this.formBuilder.group({
      sVoucher: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.specialCharacter])],
      invoiceNo: [undefined],
      orderno: [{value: undefined, disabled: true}],
      shipdate: [undefined],
      modifyDate: [undefined]
    });
    if (val) {
      this.manualPartsForm.patchValue(Object.assign({}, val, {modifyDate: new Date()}));
    }
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResizeWithoutFooter();
  }

  callbackParts(params) {
    this.partsParams = params;
    this.searchParts();
  }

  getParamsParts() {
  }

  searchParts() {
    this.loadingService.setDisplay(true);
    this.partsReceiveManualApi.findPartsByManualOrder(this.manualOrder.id)
      .subscribe((val: { parts: Array<PartsReceiveModel>, price: any }) => {
        if (val) {
          this.partsList = val.parts;
          this.partsParams.api.setRowData(this.partsList);
          this.calculateTotalParts();
        }
        this.loadingService.setDisplay(false);
      });
  }

  cellPartsValueChange(params) {
    const data = params.data;
    if (params.colDef.field === 'recvActQty') {
      if (data.recvQty && data.recvQty > 0 && Number(data.recvActQty) > Number(data.recvQty)) {
        // data.recvActQty = params.oldValue
        // params.api.setFocusedCell(params.rowIndex, params.colDef.field);

        this.swalAlertService.openWarningToast('Số lượng nhận không được lớn hơn số lượng giao', 'Số lượng nhận không đúng');
        this.gridTable.focusAfterEdit(params);

      } else {
        data.sumPrice = (Number(data.price) || 0) * (Number(data.recvActQty) || 0);
      }
    } else if (params.colDef.field === 'recvQty') {
      if (data.recvQty && data.recvQty > 0 && Number(data.recvQty) > Number(data.qty)) {
        // data.recvQty = params.oldValue
        // params.api.setFocusedCell(params.rowIndex, params.colDef.field);
        this.swalAlertService.openWarningToast('Số lượng giao không được lớn hơn số lượng đặt', 'Số lượng giao không đúng');
        this.gridTable.focusAfterEdit(params);
      } else if (Number(data.recvActQty) > Number(data.recvQty)) {
        data.recvActQty = data.recvQty;
      }
    }
    params.node.setData(data);
    this.calculateTotalParts();
  }

  cellEditingStarted(params) {
    this.startEditing = true;
  }

  cellEditingStopped(params) {
    setTimeout(() => {
      this.startEditing = false;
    }, 500);
  }

  calculateTotalParts() {
    const data = this.gridTableService.getAllData(this.partsParams);
    this.totalPartsBeforeTax = this.commonService.sumObjectByField(data, 'sumPrice');
    this.totalTax = this.commonService.sumObjectByMultipleField(data, ['sumPrice', 'rate']) / 100;
    this.totalPartsAfterTax = this.totalPartsBeforeTax + this.totalTax;
  }

  formatMoney(value) {
    return this.dataFormatService.moneyFormat(value);
  }

  receiveOrder() {
    if (this.manualPartsForm.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);

    const parts = this.partsList.map(part => {
      const locationno = part.locationNo;
      const netprice = part.price;
      const orderId = part.orderId;
      const partsId = part.partsId;
      const partscode = part.partsCode;
      const partsname = part.partsName;
      const qtyOrder = part.qty;
      const qtyRecv = part.recvQty;
      const qtyRecvact = part.recvActQty;
      const seqdisplay = part.seqdisplay;
      const unitId = part.unitId;

      return {
        locationno, netprice, orderId, partsId, partscode, partsname,
        qtyOrder, qtyRecv, qtyRecvact, seqdisplay, unitId
      };
    });

    this.partsReceiveManualLexusApi.reveiveManual(this.manualOrder.id, this.manualPartsForm.value.sVoucher, parts)
      .subscribe(() => {
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessToast('Nhận hàng thành công');
        this.print();
      });
  }

  print() {
    this.reportTypeModal.open(1);
  }

  downloadReport(event) {
    const obj = {
      receivingId: null,
      extension: event.extension
    };
    this.loadingService.setDisplay(true);
    this.serviceReportApi.printPartReceive(obj).subscribe(res => {
      this.downloadService.downloadFile(res);
      this.loadingService.setDisplay(false);
      this.modal.hide();
      this.receive.emit();
    });
  }
}

