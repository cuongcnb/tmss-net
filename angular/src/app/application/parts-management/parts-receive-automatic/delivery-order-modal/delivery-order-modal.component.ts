import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {InvoiceModel} from '../../../../core/models/parts-management/invoice.model';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {PartsReceiveAutomaticApi} from '../../../../api/parts-management/parts-receive-automatic.api';
import {PartsReceiveModel} from '../../../../core/models/parts-management/parts-receive.model';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ServiceReportApi} from '../../../../api/service-report/service-report.api';
import {DownloadService} from '../../../../shared/common-service/download.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delivery-order-modal',
  templateUrl: './delivery-order-modal.component.html',
  styleUrls: ['./delivery-order-modal.component.scss']
})
export class DeliveryOrderModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;
  @ViewChild('cellTableEditModal', {static: false}) cellTableEditModal;
  fieldPartsList;
  partsParams;
  selectedPartsIndex: number;
  selectedParts: PartsReceiveModel;
  partsList: PartsReceiveModel[];
  modalHeight;
  invoice;
  searchForm: FormGroup;
  @Output() receive = new EventEmitter();

  constructor(private setModalHeightService: SetModalHeightService,
              private partsReceiveAutomaticApi: PartsReceiveAutomaticApi,
              private loadingService: LoadingService,
              private dataFormatService: DataFormatService,
              private swalAlertService: ToastService,
              private formBuilder: FormBuilder,
              private serviceReportApi: ServiceReportApi,
              private downloadService: DownloadService) {
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
        width: 300,
        field: 'partsCode'
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        width: 450,
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
        headerTooltip: 'Số lượng đặt',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'qty'
      },
      {
        headerName: 'SL Giao',
        headerTooltip: 'Số lượng giao',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'recvQty'
      },
      {
        headerName: 'SL nhận',
        headerTooltip: 'Số lượng nhận',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'recvActQty'
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
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'price',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        width: 250,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'sumPrice',
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
        editable: true,
        type: 'text'
      }
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
      invoiceNo: [undefined],
      orderNo: [{value: undefined, disabled: true}],
      modifydate: [{value: new Date(), disabled: true}],
      svourcher: [{value: undefined, disabled: true}],
      shipdate: [{value: undefined, disabled: true}]
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

  // setRowPartsData(rowData: PartsReceiveModel) {
  //   this.partsList[this.selectedPartsIndex] = rowData;
  //   this.partsParams.api.setRowData(this.partsList);
  // }

  receiveParts() {
    this.loadingService.setDisplay(true);
    this.partsReceiveAutomaticApi.receive({
      order: Object.assign({}, this.invoice, this.searchForm.value),
      parts: this.partsList
    }).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast('Nhận thành công');
      this.downloadReport();
    });
  }


  downloadReport() {
    const obj = {
      svoucher: this.searchForm.getRawValue().svourcher,
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
