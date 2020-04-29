import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../shared/loading/loading.service';
import { OnhandOrderFollowupModel } from '../../../core/models/parts-management/parts-onhand-order-followup.model';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { PartsOnhandOrderFollowupApi } from '../../../api/parts-management/parts-onhand-order-followup.api';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ValidateBeforeSearchService } from '../../../shared/common-service/validate-before-search.service';
import { AgCheckboxRendererComponent } from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import { AgCheckboxHeaderRendererComponent } from '../../../shared/ag-checkbox-header-renderer/ag-checkbox-header-renderer.component';
import { remove } from 'lodash';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-onhand-order-followup',
  templateUrl: './parts-onhand-order-followup.component.html',
  styleUrls: ['./parts-onhand-order-followup.component.scss'],
})
export class PartsOnhandOrderFollowupComponent implements OnInit {
  form: FormGroup;

  fieldGrid;
  params;
  selectedData: Array<OnhandOrderFollowupModel> = [];
  orderData: OnhandOrderFollowupModel[] = [];

  paginationTotalsData;
  paginationParams;
  rowClassRules;

  constructor(
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private partsOnhandOrderFollowupApi: PartsOnhandOrderFollowupApi,
    private validateBeforeSearchService: ValidateBeforeSearchService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: '',
        headerTooltip: '',
        field: 'checkboxForCancel',
        width: 30,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
      },
      {
        headerName: 'Số đơn hàng',
        headerTooltip: 'Số đơn hàng',
        field: 'orderNo',
        width: 130,
        cellClass: ['cell-border', 'text-left'],
      },
      {
        headerName: 'STT',
        headerTooltip: 'Thứ tự hiển thị',
        field: 'seqDisplay',
        width: 40,
        cellClass: ['cell-border', 'text-center'],
      },
      {
        headerName: 'Mã phụ tùng',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        width: 100,
        cellClass: ['cell-border', 'text-left'],
      },
      {
        headerName: 'Tên phụ tùng',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        },
        cellClass: ['cell-border', 'text-left'],
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'cancelStatus',
        width: 110,
        cellClass: ['cell-border', 'text-left'],
        valueFormatter: params => {
          const compareArr = [{ id: 0, val: 'Bình thường' }, { id: 3, val: 'Đã nhận' }, { id: 7, val: 'ĐL đã hủy' }];
          compareArr.forEach(compare => {
            if (compare.id === Number(params.value)) {
              return compare.val;
            }
          });
        },
      },
      {
        headerName: 'Ngày đặt',
        headerTooltip: 'Ngày đặt',
        field: 'createDate',
        width: 100,
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellClass: ['cell-border', 'text-right'],
      },
      {
        headerName: 'Người đặt',
        headerTooltip: 'Người đặt',
        field: 'orderPerson',
        width: 150,
        cellClass: ['cell-border', 'text-left'],
      },
      {
        headerName: 'Ngày giao',
        headerTooltip: 'Ngày giao',
        field: 'deliveryDate',
        width: 100,
        cellClass: ['cell-border', 'text-center'],
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Số phiếu GH',
        headerTooltip: 'Số phiếu Giao hàng',
        field: 'sVoucher',
        width: 100,
        cellClass: ['cell-border', 'text-left'],
      },
      {
        headerName: 'SL Giao',
        headerTooltip: 'Số lượng Giao',
        field: 'deliveredQty',
        width: 70,
        cellClass: ['cell-border', 'text-left'],
      },
      {
        headerName: 'SL Nợ',
        headerTooltip: 'Số lượng Nợ',
        field: 'remainQty',
        width: 60,
        cellClass: ['cell-border', 'text-left'],
      },
    ];
    this.buildForm();
    this.setColorForCustomer();
  }
  private setColorForCustomer() {
    this.rowClassRules = {
      'cancel-status': params => params.data.cancelStatus === 'Đại lý hủy',
    };
  }

  callbackGrid(params) {
    this.params = params;
  }

  getParams() {
    const selectedRows = this.params.api.getSelectedRows();
    if (selectedRows) { this.selectedData = [...selectedRows]; }
  }

  changePaginationParams(paginationParams) {
    if (!this.orderData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  search() {
    if (!this.validateBeforeSearchService.validSearchDateRange(this.form.value.fromDate, this.form.value.toDate)) {
      return;
    }
    const formValue = this.validateBeforeSearchService.setBlankFieldsToNull(this.form.value);
    this.loadingService.setDisplay(true);
    this.partsOnhandOrderFollowupApi.search(formValue, this.paginationParams).subscribe(orderData => {
      this.orderData = orderData.partOrderInfoDTOs;
      this.paginationTotalsData = orderData.total;
      this.params.api.setRowData(this.orderData);
      this.loadingService.setDisplay(false);
    });
  }

  cancelPart() {
    if (!this.selectedData.length) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn phụ tùng, vui lòng chọn một phụ tùng để huỷ');
      return;
    }
    if (this.disableCancelBtn) {
      this.swalAlertService.openWarningToast('Bạn đã chọn một phụ tùng có trạng thái Hủy, hãy bỏ chọn phụ tùng đó trước khi hủy');
      return;
    }
    if (this.selectedData.length) {
      this.loadingService.setDisplay(true);
      this.partsOnhandOrderFollowupApi.cancelPart(this.selectedData).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessToast();
        this.search();
        this.selectedData = [];
      });
    }
  }

  get disableCancelBtn() {
    let status7 = false;
    this.selectedData.forEach(data => status7 = data.cancelStatus === '7');
    return status7;
  }

  private buildForm() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      orderNo: [undefined],
      partsCode: [undefined],
      fromDate: [new Date(year - 1, month, date)],
      toDate: [new Date(year, month, date, 23, 59, 59)],
      orderStatus: [0],
    });
  }
}
