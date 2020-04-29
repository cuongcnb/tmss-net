import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../../../shared/common-service/data-format.service';
import { PartsReceiveModel } from '../../../../../core/models/parts-management/parts-receive.model';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { InvoiceModel } from '../../../../../core/models/parts-management/invoice.model';
import { LexusOrderApi } from '../../../../../api/lexus-order/lexus-order.api';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-receive-delivery-lexus',
  templateUrl: './parts-receive-delivery-lexus.component.html',
  styleUrls: ['./parts-receive-delivery-lexus.component.scss'],
})
export class PartsReceiveDeliveryLexusComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('cellTableEditModal', {static: false}) cellTableEditModal;

  fieldPartsList;
  partsParams;
  selectedPartsIndex: number;
  selectedParts;
  partsList;
  modalHeight;
  invoice;
  searchForm: FormGroup;
  @Output() receive = new EventEmitter();

  constructor(private setModalHeightService: SetModalHeightService,
              private lexusOrderApi: LexusOrderApi,
              private loadingService: LoadingService,
              private dataFormatService: DataFormatService,
              private swalAlertService: ToastService,
              private formBuilder: FormBuilder) {
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
        field: 'unit'
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
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'recvActQty',
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

  reset() {
  }

  open(invoice: InvoiceModel, partsList: PartsReceiveModel[]) {
    this.invoice = invoice;
    this.partsList = partsList;
    this.buidForm();
    this.modal.show();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResizeWithoutFooter();
  }

  buidForm() {
    this.searchForm = this.formBuilder.group({
      invoiceno: [undefined],
      orderno: [{value: undefined, disabled: true}],
      modifydate: [{value: new Date(), disabled: true}],
      sVourcher: [{value: undefined, disabled: true}],
      shipdate: [{value: undefined, disabled: true}],
    });
    if (this.invoice) {
      this.searchForm.patchValue(this.invoice);
    }
  }

  callbackParts(params) {
    this.partsParams = params;
    this.partsParams.api.setRowData(this.partsList);
  }

  cellPartsDoubleClicked(params) {
    this.selectedParts = Object.assign({}, params.data);
    this.selectedPartsIndex = params.rowIndex;
  }

  receiveParts() {
    if (this.searchForm.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    this.lexusOrderApi.doautomaticallyReceiveParts({
      order: Object.assign({}, this.invoice, this.searchForm.value),
      parts: this.partsList
    }).subscribe(data => {
      this.partsParams.api.setRowData(data);
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast('Nhận thành công');
      this.receive.emit();
      this.modal.hide();
    });
  }
}
