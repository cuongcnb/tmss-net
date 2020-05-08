import { Component, EventEmitter, OnInit, Output, ViewChild, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import {
  PartsOfPrePlanOrderModel,
  PartsOrderPrePlanModel,
} from '../../../../core/models/parts-management/parts-order-pre-plan.model';
import { CurrentUserModel } from '../../../../core/models/base.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { PartOrderPrePlanApi } from '../../../../api/parts-management/part-order-pre-plan.api';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { AgDatepickerRendererComponent } from '../../../../shared/ag-datepicker-renderer/ag-datepicker-renderer.component';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-pre-plan-checking-modal',
  templateUrl: './parts-pre-plan-checking-modal.component.html',
  styleUrls: ['./parts-pre-plan-checking-modal.component.scss'],
})
export class PartsPrePlanCheckingModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  form: FormGroup;

  fieldGrid;
  params;
  selectedOrder: PartsOrderPrePlanModel;
  displayedData: Array<PartsOfPrePlanOrderModel> = [];
  frameworkComponents;

  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  constructor(
    injector: Injector,
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private gridTableService: GridTableService,
    private loadingService: LoadingService,
    private partOrderPrePlanApi: PartOrderPrePlanApi,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
  ) {
    super(injector);
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
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        field: 'qtyDlr',
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'sumPrice',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
      },
      {
        headerName: 'Ngày mong muốn',
        headerTooltip: 'Ngày mong muốn',
        field: 'expectDlrDate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellRenderer: 'agDatepickerRendererComponent',
        cellClass: ['p-0'],
        disableSelect: true,
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'remarkDlr',
      },
      {
        headerName: 'Ngày DK cung cấp',
        headerTooltip: 'Ngày DK cung cấp',
        field: 'promiseTmvDate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellRenderer: 'agDatepickerRendererComponent',
        cellClass: ['p-0'],
        disableSelect: true,
      },
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        field: 'qtyTmv',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'remarkTmv',
      },
    ];
    this.frameworkComponents = {
      agDatepickerRendererComponent: AgDatepickerRendererComponent,
    };
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(formValue, displayedData, selectedOrder) {
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
    this.selectedOrder = undefined;
  }

  callBackGrid(params) {
    this.params = params;
  }

  placeOrder() {
    // Submit
    const val = Object.assign(this.form.getRawValue(), {
      parts: this.displayedData,
    });
    const apiCall = this.selectedOrder ?
      this.partOrderPrePlanApi.updateOrder(val) : this.partOrderPrePlanApi.createNewOrder(val);
    this.loadingService.setDisplay(true);
    apiCall.subscribe(res => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast(`${this.selectedOrder ? 'Cập nhật thành công đơn hàng' : 'Tạo mới thành công đơn hàng: '} ${res.ppno}`);
      this.modal.hide();
      this.close.emit(res);
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
      id: undefined,
      planNo: [{value: undefined, disabled: true}],
      planName: [{value: undefined, disabled: true}],
      createdPerson: [{value: undefined, disabled: true}],
      status: [{value: undefined, disabled: true}],
      remark: [{value: undefined, disabled: true}],
    });
  }

}
