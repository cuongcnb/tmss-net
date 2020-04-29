import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DealerModel } from '../../../../core/models/sales/dealer.model';
import { TransportTypeModel } from '../../../../core/models/common-models/transport-type.model';
import { PartsOfSpecialOrder, PartsSpecialOrderModel, } from '../../../../core/models/parts-management/parts-special-order.model';
import { CurrentUser } from '../../../../home/home.component';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { PartsSpecialOrderApi } from '../../../../api/parts-management/parts-special-order.api';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import {ServiceReportApi} from '../../../../api/service-report/service-report.api';
import {DownloadService} from '../../../../shared/common-service/download.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-special-checking-modal',
  templateUrl: './parts-special-checking-modal.component.html',
  styleUrls: ['./parts-special-checking-modal.component.scss']
})
export class PartsSpecialCheckingModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight: number;
  form: FormGroup;

  @Input() dealerList: DealerModel[];
  @Input() transportTypeList: TransportTypeModel[];
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  currentUser = CurrentUser;

  fieldGrid;
  params;

  selectedOrder: PartsSpecialOrderModel;
  displayedData: PartsOfSpecialOrder[] = [];

  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private gridTableService: GridTableService,
    private partsSpecialOrderApi: PartsSpecialOrderApi,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private downloadService: DownloadService,
    private serviceReportApi: ServiceReportApi
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
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
      },
      {
        headerName: 'SL',
        headerTooltip: 'Số lượng',
        field: 'qty',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'sumPrice',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
      },
      {
        headerName: 'Tên xe',
        headerTooltip: 'Tên xe',
        field: 'car',
      },
      {
        field: 'modelCode',
      },
      {
        headerName: 'Số VIN',
        headerTooltip: 'Số VIN',
        field: 'vin',
      },
      {
        headerName: 'Mã CK',
        headerTooltip: 'Mã CK',
        field: 'keyCode',
      },
      {
        headerName: 'Số ghế',
        headerTooltip: 'Số ghế',
        field: 'seatNo',
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'remark',
      }
    ];
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(formValue, displayedData, selectedOrder?) {
    this.selectedOrder = selectedOrder;
    this.modal.show();
    this.buildForm();
    this.patchData(formValue, displayedData);
  }

  patchData(formValue, displayedData) {
    this.displayedData = displayedData;
    this.form.patchValue(formValue);
    setTimeout(() => {
      this.params.api.setRowData(this.displayedData);
      this.calculateFooterDetail();
    }, 300);
  }

  reset() {
    this.form = undefined;
    this.selectedOrder = undefined;
    this.displayedData = [];
  }

  callBackGrid(params) {
    this.params = params;
  }

  placeOrder() {
    const orderData = Object.assign({}, {
      order: this.form.getRawValue(),
      parts: this.displayedData
    });
    const apiCall = this.selectedOrder ?
      this.partsSpecialOrderApi.updateOrder(orderData) :
      this.partsSpecialOrderApi.create(orderData);
    this.loadingService.setDisplay(true);
    apiCall.subscribe(res => {
      this.swalAlertService.openSuccessToast(`${this.selectedOrder ? 'Cập nhật thành công đơn hàng:' : 'Tạo mới đơn hàng thành công:'} ${res.speordNo}`);
      if (res && res.id) {
        this.downloadReport(res.id);
      }
    });
  }

  calculateFooterDetail() {
    const footerDetail = this.gridTableService.calculateFooterDetail(this.displayedData);
    this.totalPriceBeforeTax = footerDetail.totalPriceBeforeTax;
    this.taxOnly = footerDetail.taxOnly;
    this.totalPriceIncludeTax = footerDetail.totalPriceIncludeTax;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      orderNo: [{ value: undefined, disabled: true }],
      receiveDlrId: [{ value: undefined, disabled: true }],
      remark: [{ value: undefined, disabled: true }],
      remarkTmv: [{ value: undefined, disabled: true }],
      status: [{ value: undefined, disabled: true }],
      transportTypeId: [{ value: undefined, disabled: true }],
    });
  }

  downloadReport(orderId) {
    const obj = {
      orderId,
      extension: 'xls'
    };
    this.serviceReportApi.printPartSpecialOrder(obj).subscribe(res => {
      this.downloadService.downloadFile(res);
      this.loadingService.setDisplay(false);
      this.modal.hide();
      this.close.emit(res);
    });
  }

}
