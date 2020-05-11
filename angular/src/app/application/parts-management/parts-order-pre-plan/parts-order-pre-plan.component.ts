import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import {
  PartsOrderPrePlanModel,
  PartsOfPrePlanOrderModel,
} from '../../../core/models/parts-management/parts-order-pre-plan.model';
import { CurrentUserModel } from '../../../core/models/base.model';
import { DealerModel } from '../../../core/models/sales/dealer.model';
import { DealerApi } from '../../../api/sales-api/dealer/dealer.api';
import { FormStoringService } from '../../../shared/common-service/form-storing.service';
import { PartOrderPrePlanApi } from '../../../api/parts-management/part-order-pre-plan.api';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { ValidateBeforeSearchService } from '../../../shared/common-service/validate-before-search.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-order-pre-plan',
  templateUrl: './parts-order-pre-plan.component.html',
  styleUrls: ['./parts-order-pre-plan.component.scss'],
})
export class PartsOrderPrePlanComponent extends AppComponentBase implements OnInit {
  @ViewChild('newOrderPlanModal', {static: false}) newOrderPlanModal;
  form: FormGroup;
  // currentUser: CurrentUserModel;

  fieldGridOrder;
  orderParams;
  orderList: Array<PartsOrderPrePlanModel>;
  selectedOrder: PartsOrderPrePlanModel;

  fieldGridParts;
  partsOfOrderParams;
  partsOfOrderList: Array<PartsOfPrePlanOrderModel>;

  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  dealerList: Array<DealerModel>;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private dealerApi: DealerApi,
    // private formStoringService: FormStoringService,
    private partOrderPrePlanApi: PartOrderPrePlanApi,
    private gridTableService: GridTableService,
    private validateBeforeSearchService: ValidateBeforeSearchService,
  ) {
    super(injector);
    this.fieldGridOrder = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
      },
      {
        headerName: 'Số kế hoạch',
        headerTooltip: 'Số kế hoạch',
        field: 'planNo',
      },
      {
        headerName: 'Tên kế hoạch',
        headerTooltip: 'Tên kế hoạch',
        field: 'planName',
      },
      {
        headerName: 'Người tạo',
        headerTooltip: 'Người tạo',
        field: 'createdPerson',
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
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'statusName',
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'remark',
      },
      {
        headerName: 'Ngày tạo',
        headerTooltip: 'Ngày tạo',
        field: 'createdDate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
    ];
    this.fieldGridParts = [
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
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
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
  }

  ngOnInit() {
    this.currentUser = this.currentUser;
    this.buildForm();
    this.getDealerList();
  }

  getDealerList() {
    if (this.currentUser.isAdmin) {
      this.loadingService.setDisplay(true);
      this.dealerApi.getAllAvailableDealers().subscribe(dealerList => {
        this.dealerList = dealerList;
        this.loadingService.setDisplay(false);
      });
    }
  }

  // =====**** ORDER GRID ****=====
  callBackGridOrder(params) {
    this.orderParams = params;
  }

  getParamsOrder() {
    const selectedOrder = this.orderParams.api.getSelectedRows();
    if (selectedOrder) {
      this.selectedOrder = selectedOrder[0];
      this.setPartsData();
    }
  }

  searchOrder(updateOrder?) {
    if (!this.validateBeforeSearchService.validSearchDateRange(this.form.value.fromDate, this.form.value.toDate)) {
      return;
    }
    const formValue = this.validateBeforeSearchService.setBlankFieldsToNull(this.form.value);
    this.loadingService.setDisplay(true);
    this.partOrderPrePlanApi.searchPrePlanOrder(formValue).subscribe(orderList => {
      this.loadingService.setDisplay(false);
      this.orderList = orderList.list;
      this.orderParams.api.setRowData(this.gridTableService.addSttToData(this.orderList));
      if (this.orderList.length) {
        updateOrder
          ? this.gridTableService.autoSelectRow(this.orderParams, this.orderList, this.selectedOrder)
          : this.gridTableService.selectFirstRow(this.orderParams);
      } else {
        this.partsOfOrderList = [];
        this.partsOfOrderParams.api.setRowData(this.partsOfOrderList);
        this.calculateFooterDetail();
      }
    });
  }

  refreshAfterEdit(updatedValue) {
    // const year = new Date().getFullYear();
    // const month = new Date().getMonth();
    // const date = new Date().getDate();
    // this.form.patchValue({
    //   planNo: updatedValue.ppno,
    //   fromDate: new Date(year, month - 1, 1).getTime(),
    //   status: 5,
    //   dlrId: !this.currentUser.isAdmin ? this.currentUser.dealerId : undefined,
    //   toDate: new Date(year, month, date, 23, 59, 59).getTime(),
    // });
    !this.selectedOrder || updatedValue.id !== this.selectedOrder.id
      ? this.searchOrder() : this.searchOrder(true);
  }

  updatePlan() {
    if (!this.selectedOrder) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn đơn hàng, hãy chọn một đơn hàng để sửa');
      return;
    } else if (this.selectedOrder.status === 3 || this.selectedOrder.status === 4) {
      this.swalAlertService.openWarningToast('Đơn hàng đã được duyệt, không thể thay đổi');
      return;
    }
    this.newOrderPlanModal.open(this.selectedOrder, this.partsOfOrderList);
  }

  deletePlan() {
    if (!this.selectedOrder) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn đơn hàng, hãy chọn một đơn hàng để xóa');
      return;
    }
    this.loadingService.setDisplay(true);
    this.partOrderPrePlanApi.deleteOrder(this.selectedOrder.id).subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.searchOrder();
      this.loadingService.setDisplay(false);
    });
  }

  // =====**** PART GRID ****=====
  callBackGridParts(params) {
    this.partsOfOrderParams = params;
  }

  setPartsData() {
    this.loadingService.setDisplay(true);
    this.partOrderPrePlanApi.getPartsOfOrder(this.selectedOrder.id).subscribe(partsOfOrderList => {
      this.partsOfOrderList = partsOfOrderList;
      this.partsOfOrderParams.api.setRowData(this.gridTableService.addSttToData(this.partsOfOrderList));
      this.loadingService.setDisplay(false);
      this.calculateFooterDetail();
    });
  }

  calculateFooterDetail() {
    const footerDetail = this.gridTableService.calculateFooterDetail(this.partsOfOrderList);
    this.totalPriceBeforeTax = footerDetail.totalPriceBeforeTax;
    this.taxOnly = footerDetail.taxOnly;
    this.totalPriceIncludeTax = footerDetail.totalPriceIncludeTax;
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      planNo: [undefined],
      fromDate: [new Date(year, month, date - 7).getTime()],
      status: [5],
      dlrId: [!this.currentUser.isAdmin ? this.currentUser.dealerId : undefined],
      toDate: [new Date(year, month, date, 23, 59, 59).getTime()],
    });
  }

}
