import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {BoPartsOrderApi} from '../../../../api/parts-management/bo-parts-order.api';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {CurrentUser} from '../../../../home/home.component';
import {CurrentUserModel} from '../../../../core/models/base.model';
import {BoOrderModel, BoPartsOfOrder} from '../../../../core/models/parts-management/bo-parts-request.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfirmService} from '../../../../shared/confirmation/confirm.service';
import {remove} from 'lodash';
import {ServiceReportApi} from '../../../../api/service-report/service-report.api';
import {DownloadService} from '../../../../shared/common-service/download.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bo-order-slip-modal',
  templateUrl: './bo-order-slip-modal.component.html',
  styleUrls: ['./bo-order-slip-modal.component.scss']
})
export class BoOrderSlipModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<any>();
  modalHeight: number;

  form: FormGroup;

  selectedOrder: BoOrderModel;
  partsOfOrder: Array<BoPartsOfOrder> = [];

  partsWithTypeCodeNotY: Array<BoPartsOfOrder> = [];
  partsWithTypeCodeY: Array<BoPartsOfOrder> = [];

  remainedParts: Array<BoPartsOfOrder> = [];

  fieldGrid;
  paramsPartsNotY;
  paramsPartsY;

  currentUser: CurrentUserModel = CurrentUser;

  footerDetail = {
    partsY: {
      totalPriceBeforeTax: null,
      taxOnly: null,
      totalPriceIncludeTax: null
    },
    partsNotY: {
      totalPriceBeforeTax: null,
      taxOnly: null,
      totalPriceIncludeTax: null
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private setModalHeightService: SetModalHeightService,
    private dataFormatService: DataFormatService,
    private boPartsOrderApi: BoPartsOrderApi,
    private gridTableService: GridTableService,
    private confirmService: ConfirmService,
    private serviceReportApi: ServiceReportApi,
    private downloadService: DownloadService
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        cellRenderer: params => params.rowIndex + 1,
        width: 80
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode'
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsName'
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit'
      },
      {
        headerName: 'SL Đặt',
        headerTooltip: 'Số lượng Đặt',
        field: 'qty',
        cellClass: ['cell-readonly', 'cell-border', 'text-right']
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thành Tiền',
        headerTooltip: 'Thành Tiền',
        field: 'sumPrice',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        cellClass: ['cell-readonly', 'cell-border', 'text-right']
      }
    ];
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedOrder, partsOfOrder) {
    this.selectedOrder = selectedOrder;
    this.partsOfOrder = partsOfOrder;
    this.remainedParts = Array.from(partsOfOrder);
    if (this.partsOfOrder) {
      this.partsOfOrder.forEach(part => {
        part.partstypeCode === 'Y' ? this.partsWithTypeCodeY.push(part) : this.partsWithTypeCodeNotY.push(part);
      });
    }
    this.buildForm();
    this.modal.show();
    setTimeout(() => {
      this.patchData();
    }, 100);
  }

  reset() {
    this.resetPartsY();
    this.resetByPartsNotY();
  }

  patchData() {
    // Split parts with partsType === Y (Phu kien) and partsType !== Y
    if (this.paramsPartsY && this.partsWithTypeCodeY.length) {
      this.paramsPartsY.api.setRowData(this.partsWithTypeCodeY);
    }
    if (this.paramsPartsNotY && this.partsWithTypeCodeNotY.length) {
      this.paramsPartsNotY.api.setRowData(this.partsWithTypeCodeNotY);
    }
    this.calculateFooterDetail();
  }

  getRemainedPart(partTypeP?) {
    remove(this.remainedParts, (part: BoPartsOfOrder) => partTypeP ? part.partstypeCode === 'Y' : part.partstypeCode !== 'Y');
    if (!this.remainedParts.length) {
      this.modal.hide();
    }
  }

  getOrderedParts(orderedParts: BoPartsOfOrder[]) {
    this.remainedParts.concat(orderedParts);
  }

  // =====**** GRID PARTS WITH PARTS TYPE CODE !== Y ****=====
  callbackGridPartsNotY(params) {
    this.paramsPartsNotY = params;
  }

  confirmPartsNotY() {
    // order then reset part
    if (!this.partsWithTypeCodeNotY.length) {
      this.toastService.openWarningToast('Danh sách phụ tùng có loại Khác phụ kiện trống, không có phụ tùng để đặt hàng');
      return;
    }
    // if (!this.partsManagementService.validateLexusPart(this.partsWithTypeCodeNotY, this.dlrLexusOfCurrentDlr, this.paramsPartsNotY, 'partsCode')) {
    //   return;
    // }

    this.loadingService.setDisplay(true);
    this.boPartsOrderApi.sendOrder(this.selectedOrder, this.partsWithTypeCodeNotY).subscribe(res => {
      if (res && res.id) {
        this.downloadReport(res.id);
      }
      this.loadingService.setDisplay(false);
      this.toastService.openSuccessToast(`Tạo thành công đơn hàng số ${res.orderno}, (loại: Khác phụ kiện)`);
      this.getOrderedParts(this.partsWithTypeCodeNotY);
      this.resetByPartsNotY(true);
      this.close.emit(this.remainedParts);
    });
    // this.getOrderedParts(this.partsWithTypeCodeNotY);
    // this.resetByPartsNotY(true);
  }

  abortPartsNotY() {
    // reset part, but not order
    this.confirmService.openConfirmModal('Bạn có chắc chắn muốn huỷ?').subscribe(() => {
      this.resetByPartsNotY(true);
    }, () => {
    });
  }

  resetByPartsNotY(setData?) {
    // reset parts list
    this.partsWithTypeCodeNotY = [];
    if (setData) {
      this.paramsPartsNotY.api.setRowData(this.partsWithTypeCodeNotY);
      this.calculateFooterDetail();
    }
    if (!this.partsWithTypeCodeY.length && !this.partsWithTypeCodeNotY.length) {
      this.modal.hide();
    }
  }

  // =====**** GRID PARTS WITH PARTS TYPE CODE === Y ****=====
  callbackGridPartsY(params) {
    this.paramsPartsY = params;
  }

  confirmPartsY() {
    // order then reset part
    if (!this.partsWithTypeCodeY.length) {
      this.toastService.openWarningToast('Danh sách phụ tùng có loại là Phụ kiện trống, không có phụ tùng để đặt hàng');
      return;
    }
    // if (!this.partsManagementService.validateLexusPart(this.partsWithTypeCodeY, this.dlrLexusOfCurrentDlr, this.paramsPartsNotY, 'partsCode')) {
    //   return;
    // }
    this.loadingService.setDisplay(true);
    this.boPartsOrderApi.sendOrder(this.selectedOrder, this.partsWithTypeCodeY).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.toastService.openSuccessToast(`Tạo thành công đơn hàng số ${res.orderno}, (loại: Phụ kiện)`);
      this.getOrderedParts(this.partsWithTypeCodeY);
      this.resetPartsY(true);
    });
    // this.getOrderedParts(this.partsWithTypeCodeY);
    // this.resetPartsY(true);
  }

  abortPartsY() {
    // reset part, but not order
    this.confirmService.openConfirmModal('Bạn có chắc chắn muốn huỷ?').subscribe(() => {
      this.resetPartsY(true);
    }, () => {
    });
  }

  resetPartsY(setData?) {
    // reset parts list
    this.partsWithTypeCodeY = [];
    if (setData) {
      this.paramsPartsY.api.setRowData(this.partsWithTypeCodeY);
      this.calculateFooterDetail();
    }
    if (!this.partsWithTypeCodeY.length && !this.partsWithTypeCodeNotY.length) {
      this.modal.hide();
    }
  }

  calculateFooterDetail() {
    this.footerDetail.partsY = this.gridTableService.calculateFooterDetail(this.partsWithTypeCodeY);
    this.footerDetail.partsNotY = this.gridTableService.calculateFooterDetail(this.partsWithTypeCodeNotY);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      ro: [{value: undefined, disabled: true}],
      userName: [{value: undefined, disabled: true}],
      transportType: [{value: undefined, disabled: true}],
      dealerName: [{value: undefined, disabled: true}],
      requestDate: [{value: undefined, disabled: true}]
    });
    if (this.selectedOrder) {
      this.form.patchValue({
        ro: this.selectedOrder.ro,
        userName: this.currentUser.userName,
        transportType: this.selectedOrder.transportType,
        dealerName: this.currentUser.dealerName,
        requestDate: this.selectedOrder.requestDate
      });
    }
  }

  downloadReport(orderId) {
    const obj = {
      orderId,
      extension: 'xls',
      orderType: 1
    };
    this.serviceReportApi.printPartBoOrder(obj).subscribe(res => {
      this.downloadService.downloadFile(res);
    });
  }
}
