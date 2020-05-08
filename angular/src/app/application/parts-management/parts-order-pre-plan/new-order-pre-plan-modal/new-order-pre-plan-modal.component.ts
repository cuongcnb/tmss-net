import { Component, EventEmitter, OnInit, Output, ViewChild, Injector } from '@angular/core';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ModalDirective } from 'ngx-bootstrap';
import {
  PartsOrderPrePlanModel,
  PartsOfPrePlanOrderModel,
} from '../../../../core/models/parts-management/parts-order-pre-plan.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { PartsInfoManagementApi } from '../../../../api/parts-management/parts-info-management.api';
import { AgDatepickerRendererComponent } from '../../../../shared/ag-datepicker-renderer/ag-datepicker-renderer.component';
import { PartOrderPrePlanApi } from '../../../../api/parts-management/part-order-pre-plan.api';
import { CurrentUserModel } from '../../../../core/models/base.model';
import { FormStoringService } from '../../../../shared/common-service/form-storing.service';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { AgDataValidateService } from '../../../../shared/ag-grid-table/ag-data-validate/ag-data-validate.service';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'new-order-plan-modal',
  templateUrl: './new-order-pre-plan-modal.component.html',
  styleUrls: ['./new-order-pre-plan-modal.component.scss'],
})
export class NewOrderPrePlanModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('searchDataGridModal', {static: false}) searchDataGridModal;
  @ViewChild('partsPrePlanCheckingModal', {static: false}) checkModal;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  selectedOrder: PartsOrderPrePlanModel;
  // currentUser: CurrentUserModel;

  fieldGrid;
  params;
  partsOfOrderData: Array<PartsOfPrePlanOrderModel> = [];
  selectedPart: PartsOfPrePlanOrderModel;
  frameworkComponents;

  displayedData: Array<PartsOfPrePlanOrderModel> = [];
  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  form: FormGroup;

  fieldGridSearchDataGrid;

  editingRowParams;
  focusCellIndex = 0;

  constructor(
    injector: Injector,
    private setModalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private partOrderPrePlanApi: PartOrderPrePlanApi,
    private formStoringService: FormStoringService,
    private gridTableService: GridTableService,
    private agDataValidateService: AgDataValidateService,
    private confirmService: ConfirmService,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.onResize();
    // this.currentUser = CurrentUser;

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
        editable: params => {
          const index = this.partsOfOrderData.indexOf(params.data);
          return !this.currentUser.isAdmin && index === -1;
        },
        validators: !this.currentUser.isAdmin ? ['required'] : [],
        cellClass: params => {
          const index = this.partsOfOrderData.indexOf(params.data);
          return (!this.currentUser.isAdmin && index === -1) ? ['cell-clickable', 'cell-border', 'partsCode'] : ['cell-readonly', 'cell-border'];
        },
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
        editable: !this.currentUser.isAdmin,
        validators: !this.currentUser.isAdmin ? ['required', 'number', 'integerNumber'] : [],
        cellClass: () => !this.currentUser.isAdmin ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-readonly', 'cell-border', 'text-right'],
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
        disableSelect: this.currentUser.isAdmin,
        validators: ['afterToday'],
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'remarkDlr',
        editable: !this.currentUser.isAdmin,
        cellClass: !this.currentUser.isAdmin ? ['cell-border', 'text-right'] : ['cell-border', 'cell-readonly', 'text-right'],
      },
      {
        headerName: 'Ngày DK cung cấp',
        headerTooltip: 'Ngày DK cung cấp',
        field: 'promiseTmvDate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellRenderer: 'agDatepickerRendererComponent',
        cellClass: ['p-0'],
        disableSelect: !this.currentUser.isAdmin,
        validators: ['afterToday'],
      },
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        field: 'qtyTmv',
        editable: this.currentUser.isAdmin,
        validators: this.currentUser.isAdmin ? ['required', 'integerNumber'] : [],
        cellClass: this.currentUser.isAdmin ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'cell-readonly', 'text-right'],
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'remarkTmv',
        editable: this.currentUser.isAdmin,
        cellClass: this.currentUser.isAdmin ? ['cell-border'] : ['cell-border', 'cell-readonly'],
      },
    ];
    this.fieldGridSearchDataGrid = [
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
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit',
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
      },
    ];
    this.frameworkComponents = {
      agDatepickerRendererComponent: AgDatepickerRendererComponent,
    };
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  searchPartApiCall(val, paginationParams?) {
    return this.partsInfoManagementApi.searchPartForOrder({ partsCode: val.partsCode || null }, paginationParams);
  }

  open(selectedOrder?, partsOfOrderData?) {
    this.selectedOrder = selectedOrder ? selectedOrder : undefined;
    this.partsOfOrderData = partsOfOrderData ? partsOfOrderData : [];
    this.buildForm();
    this.modal.show();
  }

  patchData() {
    if (this.selectedOrder && this.partsOfOrderData && this.params) {
      this.form.patchValue(this.selectedOrder);
      this.params.api.setRowData(this.gridTableService.addSttToData(this.partsOfOrderData));
      this.getDisplayedData();
      this.gridTableService.setFocusCell(this.params, 'partsCode', this.displayedData, 0);
    }
  }

  reset() {
    this.form = undefined;
    this.selectedOrder = undefined;
    this.displayedData = [];
    this.calculateFooterDetail();
  }

  // ****** AG GRID *******
  callBackGrid(params) {
    this.params = params;
    this.patchData();
  }

  getParams() {
    const selectedPart = this.params.api.getSelectedRows();
    if (selectedPart) {
      this.selectedPart = selectedPart[0];
    }
  }

  // CELL EDITING
  cellEditingStarted(params) {
    this.editingRowParams = params;
    this.params.api.forEachNode(node => {
      if (node.data === params.data) {
        node.setSelected(true);
      }
    });
  }

  cellEditingStopped(params) {
    const col = params.colDef.field;
    this.selectedPart = params.data;
    if (col === 'qtyDlr') {
      params.data.qtyDlr = parseFloat(params.data.qtyDlr);
      params.data.sumPrice = params.data.qtyDlr * parseFloat(params.data.price);
    }
    if (col === 'qtyTmv') {
      params.data.qtyTmv = parseFloat(params.data.qtyTmv);
    }
    params.api.refreshCells();
    this.getDisplayedData();
  }

  // CELL KEYBOARD EVENT
  agKeyUp(event) {
    event.stopPropagation();
    event.preventDefault();
    const keyCode = event.key;
    const srcElement = event.target as HTMLInputElement;
    const KEY_ENTER = 'Enter';
    const KEY_UP = 'ArrowUp';
    const KEY_DOWN = 'ArrowDown';
    const KEY_TAB = 'Tab';

    // Press enter to search with modal
    if (srcElement.classList.contains('partsCode') && keyCode === KEY_ENTER) {
      this.searchPartInfo({ partsCode: srcElement.innerHTML });
    }

    // Press tab to search with modal
    const editCell = this.params.api.getEditingCells();
    if (editCell && editCell.length) {
      if (keyCode === KEY_TAB && editCell[0].column.colId === 'qtyDlr') {
        this.params.api.tabToPreviousCell();
        const row = this.params.api.getDisplayedRowAtIndex(editCell[0].rowIndex);
        this.searchPartInfo({ partsCode: row.data.partsCode });
      }
    }

    // Add new row with hot keys
    const focusCell = this.params.api.getFocusedCell();
    if (keyCode === KEY_DOWN) {
      if (focusCell.rowIndex === this.focusCellIndex && focusCell.rowIndex === this.displayedData.length - 1) {
        this.onAddRow();
      }
      this.focusCellIndex = focusCell.rowIndex;
    }
    if (keyCode === KEY_UP) {
      this.focusCellIndex = focusCell.rowIndex;
    }
  }

  searchPartInfo(val) {
    this.loadingService.setDisplay(true);
    this.partsInfoManagementApi.searchPartForOrder(val).subscribe(partsInfoData => {
      this.loadingService.setDisplay(false);
      if (partsInfoData.list.length === 1) {
        this.setDataToRow(partsInfoData.list[0]);
      } else {
        this.searchDataGridModal.open(val, partsInfoData.list, partsInfoData.total);
      }
    });
  }

  // ADD ROW
  get validateBeforeAddRow() {
    const fieldToCheck = { name: 'Mã phụ tùng', field: 'partsId' };
    return !(!this.agDataValidateService.checkRequiredHiddenFields(this.params, this.displayedData, fieldToCheck)
      || !this.agDataValidateService.validateDataGrid(this.params, this.fieldGrid, this.displayedData)
    );
  }

  onAddRow() {
    if (!this.validateBeforeAddRow) {
      return;
    }
    const blankPart = {
      stt: this.displayedData.length + 1,
      partsCode: undefined,
      partsName: undefined,
      unit: undefined,
      qtyDlr: undefined,
      price: undefined,
      sumPrice: undefined,
      rate: undefined,
      expectDlrDate: undefined,
      remarkDlr: undefined,
      promiseTmvDate: undefined,
      qtyTmv: undefined,
      remarkTmv: undefined,

      partsId: undefined,
      prePlanDId: undefined,
      prePlanId: undefined,
      unitId: undefined,
    };
    this.params.api.updateRowData({ add: [blankPart] });
    this.getDisplayedData();
    // this.params.api.getModel().rowsToDisplay[this.displayedData.indexOf(blankPart)].setSelected(true)
    this.gridTableService.setFocusCell(this.params, 'partsCode', this.displayedData);
  }

  // DELETE SELECTED ROW
  deleteRow() {
    if (!this.selectedPart) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn phụ tùng, Hãy chọn một phụ tùng để xóa');
      return;
    }
    const index = this.partsOfOrderData.indexOf(this.selectedPart);
    if (index !== -1) {
      this.confirmService.openConfirmModal('Bạn có chắc chắn muốn xoá phụ tùng?', 'Thao tác sẽ không thể quay lại được!').subscribe(() => {
        this.loadingService.setDisplay(true);
        this.partOrderPrePlanApi.deletePartOfOrder(this.selectedOrder.id, this.selectedPart.prePlanDId).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.removeSelectedRow();
        }, () => {
        });
      });
    } else {
      this.removeSelectedRow();
    }
  }

  removeSelectedRow() {
    this.gridTableService.removeSelectedRow(this.params, this.selectedPart);
    this.selectedPart = undefined;
    this.getDisplayedData();
  }

  // SET DATA TO ROW
  setDataToRow(rowData) {
    const fieldToCheck = { name: 'Mã phụ tùng', field: 'partsId' };
    const rowIndex = this.displayedData.indexOf(this.selectedPart);
    const val = {
      stt: rowIndex + 1,
      id: null,
      partsCode: rowData.partsCode,
      partsName: rowData.partsName,
      unit: rowData.unit,
      qtyDlr: 0,
      price: rowData.price,
      sumPrice: 0,
      rate: rowData.rate,
      expectDlrDate: null,
      remarkDlr: null,
      promiseTmvDate: null,
      qtyTmv: null,
      remarkTmv: null,

      partsId: rowData.id,
      prePlanDId: null,
      prePlanId: null,
      unitId: rowData.unitId,
    };
    if (!this.agDataValidateService.checkDuplicateData(val, this.displayedData, fieldToCheck)) {
      this.editingRowParams.node.setDataValue(this.editingRowParams.colDef.field, this.editingRowParams.column.editingStartedValue);
      return;
    }
    this.gridTableService.setDataToRow(this.params, rowIndex, val, this.displayedData, 'qtyDlr');
    this.selectedPart = val;
    this.getDisplayedData();
  }

  // SUBMIT DATA
  viewOrder() {
    this.getDisplayedData();
    // Validate
    if (this.form.invalid) {
      return;
    }
    if (this.displayedData.length === 0) {
      this.swalAlertService.openWarningToast('Danh sánh phụ tùng trống, hãy nhập ít nhất một phụ tùng để đặt hàng', 'Cảnh báo');
      return;
    }
    if (!this.validateBeforeAddRow) {
      return;
    }
    this.checkModal.open(this.form.getRawValue(), this.displayedData, this.selectedOrder);

    // // Submit
    // const val = Object.assign(this.form.getRawValue(), {
    //   parts: this.displayedData,
    // });
    // const apiCall = this.selectedOrder ?
    //   this.partOrderPrePlanApi.updateOrder(val) : this.partOrderPrePlanApi.createNewOrder(val);
    // this.loadingService.setDisplay(true);
    // apiCall.subscribe(res => {
    //   this.loadingService.setDisplay(false);
    //   this.swalAlertService.openSuccessToast(`${this.selectedOrder ? 'Cập nhật thành công đơn hàng' : 'Tạo mới thành công đơn hàng: '} ${res.ppno}`);
    //   this.modal.hide();
    //   this.close.emit(res);
    // });
  }

  getDisplayedData() {
    this.displayedData = this.gridTableService.getAllData(this.params);
    this.calculateFooterDetail();
  }

  calculateFooterDetail() {
    const footerDetail = this.gridTableService.calculateFooterDetail(this.displayedData);
    this.totalPriceBeforeTax = footerDetail.totalPriceBeforeTax;
    this.taxOnly = footerDetail.taxOnly;
    this.totalPriceIncludeTax = footerDetail.totalPriceIncludeTax;
  }

  cancelSearchParts() {
    if (this.editingRowParams) {
      this.editingRowParams.node.setDataValue(this.editingRowParams.colDef.field, this.editingRowParams.column.editingStartedValue);
      this.editingRowParams.api.setFocusedCell(this.editingRowParams.rowIndex, this.editingRowParams.colDef.field);
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: undefined,
      planNo: [{ value: undefined, disabled: true }],
      planName: [undefined, GlobalValidator.required],
      createdPerson: [{ value: this.currentUser.userName, disabled: true }],
      status: [{ value: 1, disabled: !this.currentUser.isAdmin }],
      remark: [undefined],
    });
  }

}
