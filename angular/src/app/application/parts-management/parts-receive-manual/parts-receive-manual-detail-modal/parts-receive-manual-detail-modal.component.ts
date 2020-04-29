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
import {TMSSTabs} from '../../../../core/constains/tabs';
import {EventBusService} from '../../../../shared/common-service/event-bus.service';
import {ToastrService} from 'ngx-toastr';
import {ServiceReportApi} from '../../../../api/service-report/service-report.api';
import {DownloadService} from '../../../../shared/common-service/download.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-receive-manual-detail-modal',
  templateUrl: './parts-receive-manual-detail-modal.component.html',
  styleUrls: ['./parts-receive-manual-detail-modal.component.scss']
})
export class PartsReceiveManualDetailModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('cellTableEditModal', {static: false}) cellTableEditModal;
  @ViewChild('gridTable', {static: false}) gridTable;
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;
  @Output() receive = new EventEmitter();
  modalHeight: number;
  manualOrder: ManualOrderModel;

  fieldPartsList;
  partsList: PartsReceiveModel[];
  partsParams;

  manualPartsForm: FormGroup;

  totalPartsBeforeTax;
  totalTax;
  totalPartsAfterTax;

  startEditing;
  received = false;

  constructor(
    private partsReceiveManualApi: PartsReceiveManualApi,
    private setModalHeightService: SetModalHeightService,
    private commonService: CommonService,
    private swalAlertService: ToastService,
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService,
    private gridTableService: GridTableService,
    private eventBus: EventBusService,
    private toastrService: ToastrService,
    private serviceReportApi: ServiceReportApi,
    private downloadService: DownloadService
  ) {
    this.fieldPartsList = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
        width: 120
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
        }, width: 350
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit'
      },
      {
        headerName: 'SL Đặt',
        headerTooltip: 'Số lượng Đặt',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'qty'
      },
      {
        headerName: 'SL Giao',
        headerTooltip: 'Số lượng Giao',
        cellClass: ['cell-border', 'cell-clickable', 'text-right'],
        field: 'recvQty',
        validators: ['number', 'notNagetiveIntNumber'],
        editable: true
      },
      {
        headerName: 'SL nhận',
        headerTooltip: 'Số lượng nhận',
        cellClass: ['cell-border', 'cell-clickable', 'text-right'],
        field: 'recvActQty',
        validators: ['number', 'notNagetiveIntNumber'],
        editable: true
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
        cellClass: ['cell-border'],
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
    if (this.received) {
      this.receive.emit();
    }
    this.received = false;
  }

  buildForm(val?) {
    this.manualPartsForm = this.formBuilder.group({
      svourcher: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.specialCharacter, GlobalValidator.inputFormat])],
      invoiceNo: [undefined],
      orderNo: [{value: undefined, disabled: true}],
      shipdate: [undefined],
      modifyDate: [{value: undefined, disabled: true}]
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
    this.partsReceiveManualApi.findPartsByManualOrder(this.manualOrder.id).subscribe((val: { parts: Array<PartsReceiveModel>, price: any }) => {
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
        this.swalAlertService.openWarningToast('Số lượng nhận không được lớn hơn số lượng giao', 'Số lượng nhận không đúng');
        this.gridTable.focusAfterEdit(params);

      } else {
        data.sumPrice = (Number(data.price) || 0) * (Number(data.recvActQty) || 0);
      }
    }
    if (params.colDef.field === 'recvQty') {
      if (data.recvQty && data.recvQty > 0 && Number(data.recvQty) > Number(data.qty)) {
        this.swalAlertService.openWarningToast('Số lượng giao không được lớn hơn số lượng đặt', 'Số lượng giao không đúng');
        this.gridTable.focusAfterEdit(params);
      } else if (Number(data.recvActQty) > Number(data.recvQty)) {
        data.recvActQty = data.recvQty;
        data.sumPrice = (Number(data.price) || 0) * (Number(data.recvActQty) || 0);
      }
    }
    params.node.setData(data);
    // params.api.refreshCells();
    this.calculateTotalParts();

  }

  cellEditingStarted() {
    this.startEditing = true;
  }

  cellEditingStopped() {
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
    this.partsReceiveManualApi.reveiveManual({
      order: Object.assign({}, this.manualOrder, this.manualPartsForm.value),
      parts: this.partsList
    }).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.toastrService.success('Nhận hàng thành công', 'Thông báo');
      this.downloadReport();
    });
  }

  // print() {
  //   this.reportTypeModal.open(1);
  // }

  downloadReport() {
    const obj = {
      svoucher: this.manualPartsForm.getRawValue().svourcher,
      extension: 'pdf'
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
