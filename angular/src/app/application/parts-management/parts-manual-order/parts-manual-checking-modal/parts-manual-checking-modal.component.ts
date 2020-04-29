import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TransportTypeModel} from '../../../../core/models/common-models/transport-type.model';
import {OrderMethodModel} from '../../../../core/models/common-models/order-method.model';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {CurrentUser} from '../../../../home/home.component';
import {CurrentUserModel} from '../../../../core/models/base.model';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {DownloadService} from '../../../../shared/common-service/download.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {PartsManualOrderApi} from '../../../../api/parts-management/parts-manual-order.api';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {
  ManualOrderModel,
  PartsOfManualOrderModel
} from '../../../../core/models/parts-management/parts-manual-order.model';
import {ServiceReportApi} from '../../../../api/service-report/service-report.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-manual-checking-modal',
  templateUrl: './parts-manual-checking-modal.component.html',
  styleUrls: ['./parts-manual-checking-modal.component.scss']
})
export class PartsManualCheckingModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight: number;
  form: FormGroup;

  @Input() transportTypeList: TransportTypeModel[];
  @Input() orderMethodArr: OrderMethodModel[];
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  currentUser: CurrentUserModel = CurrentUser;
  selectedOrder: ManualOrderModel;

  fieldGrid;
  params;
  displayedData: PartsOfManualOrderModel[] = [];

  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private gridTableService: GridTableService,
    private downloadService: DownloadService,
    private loadingService: LoadingService,
    private partsManualOrderApi: PartsManualOrderApi,
    private swalAlertService: ToastService,
    private serviceReportApi: ServiceReportApi
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {headerName: 'STT', headerTooltip: 'Số thứ tự', field: 'stt', width: 25},
          {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode', width: 60},
          {headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
               return params.data && params.data.partsNameVn && !!params.data.partsNameVn
                 ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
            }},
          {headerName: 'ĐVT', headerTooltip: 'Đơn vị tính', field: 'unit', width: 30},
          {
            headerName: 'DAD', headerTooltip: 'DAD', field: 'dad', width: 30,
            cellClass: ['text-right', 'cell-border', 'cell-readonly'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value)
          },
          {
            headerName: 'SL Tồn', headerTooltip: 'Số lượng Tồn', field: 'onHandQty', width: 40,
            cellClass: ['text-right', 'cell-border', 'cell-readonly'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value)
          },
          {
            headerName: 'SL ĐĐ', headerTooltip: 'Số lượng ĐĐ', field: 'onOrderQty', width: 40,
            cellClass: ['text-right', 'cell-border', 'cell-readonly'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value)
          },
          {
            headerName: 'MIP', headerTooltip: 'MIP', field: 'mip', width: 30,
            cellClass: ['text-right', 'cell-border', 'cell-readonly'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value)
          },
          {
            headerName: 'SL đặt DK', headerTooltip: 'Số lượng đặt DK', field: 'suggestOrderQty', width: 50,
            cellClass: ['text-right', 'cell-border', 'cell-readonly'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value)
          }
        ]
      },
      {
        headerName: 'Tồn kho TMV',
        headerTooltip: 'Tồn kho TMV',
        children: [
          {
            headerName: 'CPD', headerTooltip: 'CPD', field: 'cpd', width: 30,
            cellClass: ['text-right', 'cell-border', 'cell-readonly'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value)
          },
          {
            headerName: 'SPD', headerTooltip: 'SPD', field: 'spd', width: 30,
            cellClass: ['text-right', 'cell-border', 'cell-readonly'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value)
          },
          {
            headerName: 'Max Allocate', headerTooltip: 'Max Allocate', field: 'maxAllocate', width: 60,
            cellClass: ['text-right', 'cell-border', 'cell-readonly'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value)
          }
        ]
      },
      {
        headerName: 'SL Đặt thực tế',
        headerTooltip: 'Số lượng Đặt thực tế',
        children: [
          {
            headerName: 'SL Đặt', headerTooltip: 'Số lượng Đặt', field: 'qty', width: 40,
            validators: ['required', 'integerNumber'],
            cellClass: ['text-right', 'cell-border', 'cell-readonly']
          },
          {
            headerName: 'BO', headerTooltip: 'BO', field: 'boQty', width: 20,
            cellClass: ['text-right', 'cell-border', 'cell-readonly']
          }
        ]
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'price', width: 55,
            cellClass: ['text-right', 'cell-border', 'cell-readonly'],
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
          },
          {
            headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'sumPrice', width: 75,
            cellClass: ['text-right', 'cell-border', 'cell-readonly'],
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
          },
          {
            headerName: 'Thuế', headerTooltip: 'Thuế', field: 'rate', width: 30,
            cellClass: ['text-right', 'cell-border', 'cell-readonly']
          }
        ]
      }
    ];
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(formValue, displayedData, selectedOrder?) {
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
    this.displayedData = [];
  }

  callBackGrid(params) {
    this.params = params;
  }

  getParams() {
  }

  placeOrder() {
    // Submit
    const val = Object.assign(this.form.getRawValue(), {
      parts: this.displayedData
    });
    this.loadingService.setDisplay(true);
    this.partsManualOrderApi.createNewOrder(val).subscribe(res => {
      if (res && res.id) {
        this.downloadReport(res.id);
      }
      // this.partsManualOrderApi.downloadNewOrder(res.id).subscribe(file => {
      //   this.swalAlertService.openSuccessToast(this.selectedOrder ? `Cập nhật thành công đơn hàng: ${res.orderno}` : `Tạo mới đơn hàng thành công: ${res.orderno}`);
      //   this.downloadService.downloadFile(file);
      //   this.loadingService.setDisplay(false);
      // });
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
      orderNo: [{value: undefined, disabled: true}],
      orderDateView: [{value: undefined, disabled: true}],
      orderDate: [{value: undefined, disabled: true}],
      orderPersonId: [{value: undefined, disabled: true}],
      transportTypeId: [{value: undefined, disabled: true}],
      orderTypeId: [{value: undefined, disabled: true}]
    });
  }

  downloadReport(orderId) {
    const obj = {
      orderId,
      extension: 'xls',
      orderType: 2
    };
    this.serviceReportApi.printPartBoOrder(obj).subscribe(res => {
      this.downloadService.downloadFile(res);
      this.close.emit(res);
      this.loadingService.setDisplay(false);
      this.modal.hide();
    });
  }
}
