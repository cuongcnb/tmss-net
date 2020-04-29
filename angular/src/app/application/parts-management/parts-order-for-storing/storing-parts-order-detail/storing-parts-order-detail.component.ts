import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {PartsOrderForStoringModel} from '../../../../core/models/parts-management/parts-order-for-storing.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {PartsOrderForStoringApi} from '../../../../api/parts-management/parts-order-for-storing.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {CurrentUser} from '../../../../home/home.component';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {ServiceReportApi} from '../../../../api/service-report/service-report.api';
import {DownloadService} from '../../../../shared/common-service/download.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'storing-parts-order-detail',
  templateUrl: './storing-parts-order-detail.component.html',
  styleUrls: ['./storing-parts-order-detail.component.scss']
})
export class StoringPartsOrderDetailComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  form: FormGroup;

  fieldGrid;
  params;
  displayedData: Array<PartsOrderForStoringModel>;

  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  orderPlaced = false;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private partsOrderForStoringApi: PartsOrderForStoringApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private formStoringService: FormStoringService,
    private gridTableService: GridTableService,
    private serviceReportApi: ServiceReportApi,
    private downloadService: DownloadService
  ) {
    this.fieldGrid = [
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'STT',
            headerTooltip: 'Số thứ tự',
            field: 'stt'
          },
          {
            headerName: 'Mã PT',
            headerTooltip: 'Mã phụ tùng',
            field: 'partsCode',
            minWidth: 150
          },
          {
            headerName: 'Tên PT',
            headerTooltip: 'Tên phụ tùng',
            valueGetter: params => {
               return params.data && params.data.partsNameVn && !!params.data.partsNameVn
                 ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
            },
            minWidth: 150
          },
          {
            headerName: 'ĐVT',
            headerTooltip: 'Đơn vị tính',
            field: 'unit'
          },
          {
            headerName: 'MAD',
            headerTooltip: 'MAD',
            field: 'mad',
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
          },
          {
            headerName: 'MIP',
            headerTooltip: 'MIP',
            field: 'mip',
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
          },
          {
            headerName: 'SL Tồn',
            headerTooltip: 'Số lượng Tồn',
            field: 'onHandQty',
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
          },
          {
            headerName: 'SL ĐĐ',
            headerTooltip: 'Số lượng ĐĐ',
            field: 'onOrderQty',
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
          },
          {
            headerName: 'SL Đặt DK',
            headerTooltip: 'Số lượng Đặt DK',
            field: 'suggestOrderQty',
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
          }
        ]
      },
      {
        headerName: 'Tồn kho TMV',
        headerTooltip: 'Tồn kho TMV',
        children: [
          {
            headerName: 'CPD',
            headerTooltip: 'CPD',
            field: 'cpd'
          },
          {
            headerName: 'SPD',
            headerTooltip: 'SPD',
            field: 'spd'
          },
          {
            headerName: 'Leadtime',
            headerTooltip: 'Leadtime',
            field: 'estLeadTime'
          }
        ]
      },
      {
        headerName: 'SL đặt thực tế',
        headerTooltip: 'Số lượng đặt thực tế',
        children: [
          {
            headerName: 'Nhận ngay',
            headerTooltip: 'Nhận ngay',
            field: 'immediateUseQty'
          },
          {
            headerName: 'Nhận sau',
            headerTooltip: 'Nhận sau',
            field: 'laterUseQty'
          }
        ]
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
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
            field: 'remark'
          }
        ]
      }
    ];
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(displayedData) {
    this.displayedData = displayedData;
    this.buildForm();
    this.setRowData();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
    this.params.api.setRowData([]);
    if (this.orderPlaced) {
      this.close.emit();
    }
    this.orderPlaced = false;
  }

  setRowData() {
    if (this.params) {
      this.params.api.setRowData(this.gridTableService.addSttToData(this.displayedData));
      this.calculateFooterDetail();
    }
  }

  callbackGrid(params) {
    this.params = params;
    this.setRowData();
  }

  calculateFooterDetail() {
    const footerDetail = this.gridTableService.calculateFooterDetail(this.displayedData);
    this.totalPriceBeforeTax = footerDetail.totalPriceBeforeTax;
    this.taxOnly = footerDetail.taxOnly;
    this.totalPriceIncludeTax = footerDetail.totalPriceIncludeTax;
  }

  sendRequest() {
    this.loadingService.setDisplay(true);
    this.partsOrderForStoringApi.orderParts(this.displayedData).subscribe(res => {
      if (res && res.id) {
        this.downloadReport(res.id);
      }
      this.swalAlertService.openSuccessToast(`Tạo mới đơn hàng thành công: ${res.orderno}`);
      this.orderPlaced = true;
      this.modal.hide();
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      orderNo: [{value: undefined, disabled: true}],
      orderDate: [{value: this.dataFormatService.parseTimestampToFullDate(new Date()), disabled: true}],
      userRequest: [{value: CurrentUser.userName, disabled: true}]
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
    });
  }
}
