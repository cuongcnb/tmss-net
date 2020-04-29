import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {GlobalValidator} from '../../../shared/form-validation/validators';
import {PartsInStockAdjustmentApi} from '../../../api/parts-management/parts-in-stock-adjustment.api';
import {
  PartsInStockAdjustmentModel,
  PartsInStockHistoryModel
} from '../../../core/models/parts-management/parts-in-stock-adjustment.model';
import {GridTableService} from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-in-stock-adjustment',
  templateUrl: './parts-in-stock-adjustment.component.html',
  styleUrls: ['./parts-in-stock-adjustment.component.scss']
})
export class PartsInStockAdjustmentComponent implements OnInit {
  @ViewChild('submitAdjustmentFormBtn', {static: false}) submitAdjustmentFormBtn: ElementRef;
  searchForm: FormGroup;
  partAdjustmentForm: FormGroup;

  fieldGridPartsInfo;
  partsInfoParams;
  partsData: Array<PartsInStockAdjustmentModel>;
  selectedPart: PartsInStockAdjustmentModel;

  fieldGridPartHistory;
  partHistoryParams;
  partHistoryData: Array<PartsInStockHistoryModel>;

  paginationParams;
  paginationTotalsData: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private partsInStockAdjustmentApi: PartsInStockAdjustmentApi,
    private gridTableService: GridTableService
  ) {
    this.fieldGridPartsInfo = [
      {
        headerName: 'Mã phụ tùng',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode'
      },
      {
        headerName: 'Tên phụ tùng',
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
        headerName: 'Giá mua',
        headerTooltip: 'Giá mua',
        field: 'price',
        cellClass: ['cell-border', 'text-right', 'cell-readonly'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Giá bán',
        headerTooltip: 'Giá bán',
        field: 'sellPrice',
        cellClass: ['cell-border', 'text-right', 'cell-readonly'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      }
    ];
    this.fieldGridPartHistory = [
      {
        headerName: 'Mã phụ tùng',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode'
      },
      {
        headerName: 'Tên phụ tùng',
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
        headerName: 'Giá nhập',
        headerTooltip: 'Giá nhập',
        field: 'price',
        cellClass: ['cell-border', 'text-right', 'cell-readonly'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'SL nhập',
        headerTooltip: 'Số lượng nhập',
        field: 'inQty',
        cellClass: ['cell-border', 'text-right', 'cell-readonly']
      },
      {
        headerName: 'SL Đã xuất',
        headerTooltip: 'Số lượng Đã xuất',
        field: 'outQty',
        cellClass: ['cell-border', 'text-right', 'cell-readonly']
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        cellClass: ['cell-border', 'text-right', 'cell-readonly']
      },
      {
        headerName: 'Ngày nhập',
        headerTooltip: 'Ngày nhập',
        field: 'warehouseDate',
        cellClass: ['cell-border', 'text-right', 'cell-readonly'],
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      }
    ];
  }

  ngOnInit() {
    this.buildForm();
  }

  adjustQtyChange(val) {
    this.partAdjustmentForm.controls.adjustQty.patchValue(this.dataFormatService.formatQty(val));
    // this.partAdjustmentForm.controls.adjustQty.patchValue(Math.ceil(val * 100) / 100);
  }


  // ====**** PART GRID ****====
  callBackGridPartsInfo(params) {
    this.partsInfoParams = params;
  }

  getParamsPartsInfo() {
    const selectedPart = this.partsInfoParams.api.getSelectedRows();
    if (selectedPart) {
      this.selectedPart = selectedPart[0];
      this.searchPartHistory();
    }
  }

  search() {
    this.loadingService.setDisplay(true);
    this.partsInStockAdjustmentApi
      .searchPartInStock(this.searchForm.value, this.paginationParams).subscribe(partsData => {
      this.loadingService.setDisplay(false);
      this.partsData = partsData.list;
      this.paginationTotalsData = partsData.total;
      this.partsInfoParams.api.setRowData(this.partsData);
      if (this.partsData.length) {
        this.gridTableService.autoSelectRow(this.partsInfoParams, this.partsData, this.selectedPart);
      } else {
        this.partAdjustmentForm.reset();
        this.partHistoryData = [];
        this.partHistoryParams.api.setRowData(this.partHistoryData);
      }
    });
  }

  changePaginationParams(paginationParams) {
    if (!this.partsData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  // ====**** HISTORY GRID ****====
  callBackGridPartHistory(params) {
    this.partHistoryParams = params;
  }

  searchPartHistory() {
    if (this.selectedPart) {
      this.partAdjustmentForm.patchValue(this.selectedPart);
      // this.partAdjustmentForm.patchValue(Object.assign(this.selectedPart, {
      //   adjustQty: 0,
      //   adjustReason: 'Lý do ĐC',
      // }));
      this.loadingService.setDisplay(true);
      this.partsInStockAdjustmentApi.searchPartHistory(this.selectedPart.id).subscribe(partHistoryData => {
        this.loadingService.setDisplay(false);
        this.partHistoryData = partHistoryData;
        this.partHistoryParams.api.setRowData(this.partHistoryData);
        this.gridTableService.autoSizeColumn(this.partHistoryParams);
      });
    }
  }

  private validateBeforeSubmit(decrease) {
    if (!this.selectedPart) {
      this.swalAlertService.openWarningToast('Hãy chọn một phụ tùng trong kho để điều chỉnh');
      return false;
    }

    this.submitAdjustmentFormBtn.nativeElement.click();
    const rawFormValue = this.partAdjustmentForm.getRawValue();
    if (this.partAdjustmentForm.controls.adjustQty.invalid) {
      this.swalAlertService.openWarningToast('Trường "SL Sau DC" là bắt buộc');
      // this.partAdjustmentForm.controls.adjustQty.setValue(Math.round(100 * Number(this.partAdjustmentForm.controls.adjustQty.value)) / 100);
      return false;
    }
    if (this.partAdjustmentForm.controls.adjustReason.invalid) {
      this.swalAlertService.openWarningToast('Bắt buộc nhập trường "Lý do DC"');
      return false;
    }
    if (parseFloat(this.partAdjustmentForm.value.adjustQty) === rawFormValue.qty) {
      this.swalAlertService.openWarningToast('SL Sau DC chỉnh phải khác SL Trước ĐC');
      return false;
    }
    if (decrease && parseFloat(this.partAdjustmentForm.value.adjustQty) > rawFormValue.qty) {
      this.swalAlertService.openWarningToast('SL Sau DC chỉnh giảm phải nhỏ hơn SL Trước ĐC');
      return false;
    }
    if (!decrease && parseFloat(this.partAdjustmentForm.value.adjustQty) < rawFormValue.qty) {
      this.swalAlertService.openWarningToast('SL Sau DC chỉnh tăng phải lớn hơn SL Trước ĐC');
      return false;
    }
    if (decrease && !rawFormValue.qty) {
      this.swalAlertService.openWarningToast('Số lượng hiện tại đã bằng 0, không thể điều chỉnh giảm được nữa');
      return false;
    }
    return true;
  }

  submitAdjustmentForm(decrease?) {
    if (!this.validateBeforeSubmit(decrease)) {
      return;
    }

    const value = Object.assign({}, {
      adjustQty: this.partAdjustmentForm.getRawValue().adjustQty,
      adjustReason: this.partAdjustmentForm.getRawValue().adjustReason,
      partsId: this.partAdjustmentForm.getRawValue().id,
      locationNo: this.partAdjustmentForm.getRawValue().locationNo,
      qty: this.partAdjustmentForm.getRawValue().qty
    });
    this.loadingService.setDisplay(true);
    this.partsInStockAdjustmentApi.partAdjust(value, decrease ? 2 : 1).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
      this.refreshAfterChange();
    });
  }

  refreshAfterChange() {
    // this.searchForm.patchValue({
    //   partsCode: this.selectedPart.partsCode,
    // });
    this.partAdjustmentForm.reset();
    this.search();
  }

  private buildForm() {
    this.searchForm = this.formBuilder.group({
      partsCode: [''],
      type: [1]
    });
    this.partAdjustmentForm = this.formBuilder.group({
      qty: [{value: '', disabled: true}],
      instocktype: [{value: '', disabled: true}],
      locationNo: [{value: '', disabled: true}],
      mad: [{value: '', disabled: true}],
      mip: [{value: '', disabled: true}],
      adjustQty: ['', Validators.compose([GlobalValidator.required])],
      adjustReason: ['', GlobalValidator.required],
      id: ['']
    });

  }
  deleteCharacterSpecial(val) {
    if (val) {
      this.searchForm.get('partsCode').setValue(val.replace(/[^a-zA-Z0-9,]/g, ''));
    }
  }
}
