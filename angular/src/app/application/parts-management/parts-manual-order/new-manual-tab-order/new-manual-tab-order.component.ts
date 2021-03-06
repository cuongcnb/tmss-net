import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Injector} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';

import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {ManualOrderModel, PartsOfManualOrderModel} from '../../../../core/models/parts-management/parts-manual-order.model';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {DivisionCommonApi} from '../../../../api/common-api/division-common.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {OrderMethodModel} from '../../../../core/models/common-models/order-method.model';
import {TransportTypeModel} from '../../../../core/models/common-models/transport-type.model';
import {PartsManualOrderApi} from '../../../../api/parts-management/parts-manual-order.api';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {AgDataValidateService} from '../../../../shared/ag-grid-table/ag-data-validate/ag-data-validate.service';
import {ConfirmService} from '../../../../shared/confirmation/confirm.service';
import {CurrentUserModel} from '../../../../core/models/base.model';
import {DealerModel} from '../../../../core/models/sales/dealer.model';
import {OrderForLexusPartApi} from '../../../../api/parts-management/order-for-lexus-part.api';
import {CheckingLexusPartModel, PartsManagementService} from '../../parts-management.service';
import {forkJoin} from 'rxjs';
import {OrderMethodApi} from '../../../../api/common-api/order-method.api';
import {TransportTypeApi} from '../../../../api/common-api/transport-type.api';
import {TMSSTabs} from '../../../../core/constains/tabs';
import {EventBusService} from '../../../../shared/common-service/event-bus.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'new-manual-tab-order',
  templateUrl: './new-manual-tab-order.component.html',
  styleUrls: ['./new-manual-tab-order.component.scss']
})
export class NewManualTabOrderComponent extends AppComponentBase implements OnInit {
  @ViewChild('submitFormBtn', {static: false}) submitFormBtn: ElementRef;
  @ViewChild('searchDataGridModal', {static: false}) searchDataGridModal;
  @ViewChild('selectPackOfPartsModal', {static: false}) selectPackOfPartsModal;
  @ViewChild('partsManualCheckingModal', {static: false}) partsManualCheckingModal;
  // tslint:disable-next-line:no-output-native
  orderMethodArr: Array<OrderMethodModel> = [];
  transportTypeList: Array<TransportTypeModel>;
  dlrLexusOfCurrentDlr: DealerModel;
  modalHeight: number;

  form: FormGroup;
  selectedOrder: ManualOrderModel;
  partsOfOrderData: Array<PartsOfManualOrderModel> = [];
  displayedData: Array<PartsOfManualOrderModel> = [];

  fieldGrid;
  params;
  selectedPart: PartsOfManualOrderModel;

  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  fieldGridSearchDataGrid;

  // currentUser: CurrentUserModel = CurrentUser;
  focusCellIndex = 0;
  editingRowParams;
  currentOrderTypeId: number;

  constructor(
    injector: Injector,
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private dataFormatService: DataFormatService,
    private divisionApi: DivisionCommonApi,
    private loadingService: LoadingService,
    private partsManualOrderApi: PartsManualOrderApi,
    // private formStoringService: FormStoringService,
    private gridTableService: GridTableService,
    private agDataValidateService: AgDataValidateService,
    private confirmService: ConfirmService,
    private orderForLexusPartApi: OrderForLexusPartApi,
    private partsManagementService: PartsManagementService,
    private orderMethodApi: OrderMethodApi,
    private transportTypeApi: TransportTypeApi,
    private eventBus: EventBusService
  ) {
    super(injector);
    this.masterDataApi();
    this.getLexusOfCurrentDealer();
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {headerName: 'STT', headerTooltip: 'Số thứ tự', field: 'stt', width: 25},
          {
            headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', aderName: 'Mã PT', field: 'partsCode', width: 60,
            editable: params => this.partsOfOrderData.indexOf(params.data) === -1,
            cellClass: params => {
              if (this.partsOfOrderData.indexOf(params.data) === -1) {
                return ['cell-clickable', 'cell-border', 'partsCode'];
              }
            },
            validators: ['required']
          },
          {
            headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
              return params.data && params.data.partsNameVn && !!params.data.partsNameVn
                ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
            }
          },
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
            cellClass: ['text-right', 'cell-border', 'cell-clickable'],
            editable: true
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
    this.fieldGridSearchDataGrid = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode', width: 75},
      {
        headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
        }, minWidth: 300, maxWidth: 500
      },
      {
        headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'price', width: 60,
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {headerName: 'ĐVT', headerTooltip: 'Đơn vị tính', field: 'unit', width: 40},
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'rate', width: 40}
    ];
    this.onResize();
  }

  masterDataApi() {
    this.loadingService.setDisplay(true);
    forkJoin([
      this.orderMethodApi.getListForManualOrder(),
      this.transportTypeApi.getAll(false)
    ]).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.orderMethodArr = res[0];
      this.transportTypeList = res[1];
      this.buildForm();
    });
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  searchPartApiCall(val, paginationParams?) {
    return this.partsManualOrderApi.searchPartForNewOrder({
      partsCode: val.partsCode || null,
      orderTypeId: val.orderTypeId || null
    }, paginationParams);
  }

  open(selectedOrder?: ManualOrderModel, partsOfOrderData?: Array<PartsOfManualOrderModel>) {
    this.selectedOrder = selectedOrder ? selectedOrder : undefined;
    this.partsOfOrderData = partsOfOrderData ? partsOfOrderData : [];
    this.buildForm();
  }

  patchData() {
    if (this.selectedOrder) {
      this.form.patchValue(this.selectedOrder);
      this.params.api.setRowData(this.partsOfOrderData);
      this.getDisplayedData();
      if (this.partsOfOrderData.length > 0) {
        this.gridTableService.setFocusCell(this.params, 'partsCode', this.displayedData, 0);
      }
    }
  }

  getLexusOfCurrentDealer() {
    this.loadingService.setDisplay(true);
    this.orderForLexusPartApi.getLexusOfCurrentDealer().subscribe(dlrLexusOfCurrentDlr => {
      this.loadingService.setDisplay(false);
      this.dlrLexusOfCurrentDlr = dlrLexusOfCurrentDlr;
    });
  }

  reset() {
    this.form = undefined;
    this.selectedOrder = undefined;
    this.displayedData = [];
    this.dlrLexusOfCurrentDlr = undefined;
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
    switch (col) {
      case 'partsCode':
        if (!params.value || !params.value) {
          return;
        }
        this.params.api.forEachNode(rowNode => {
          if (params.rowIndex === rowNode.rowIndex && params.value) {
            rowNode.setDataValue('partsCode', params.value.replace(/[^a-zA-Z0-9]/g, ''));
          }
        });
        break;
      case 'qty':
        params.data.qty = parseFloat(this.dataFormatService.numberFormat(params.data.qty));
        params.data.sumPrice = parseFloat(params.data.qty) * parseFloat(params.data.price);
        if (params.rowIndex === this.gridTableService.getAllData(this.params).length - 1) {
          this.gridTableService.setFocusCell(this.params, this.fieldGrid[0].children[1].field, null, params.rowIndex);
        }
        break;
    }
    params.api.refreshCells();
    this.getDisplayedData();
  }

  // CELL KEYBOARD EVENT
  agKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    const keyCode = event.key;
    const srcElement = event.target as HTMLInputElement;
    const KEY_ENTER = 'Enter';
    const KEY_UP = 'ArrowUp';
    const KEY_DOWN = 'ArrowDown';
    const KEY_TAB = 'Tab';

    const focusCell = this.params.api.getFocusedCell();

    // Press enter to search with modal
    if (keyCode === KEY_ENTER) {
      this.focusCellIndex = focusCell.rowIndex;
      if (srcElement.classList.contains('partsCode')) {
        this.searchPartInfo({partsCode: srcElement.innerHTML, orderTypeId: this.form.value.orderTypeId});
      }
    }

    // Press tab to search with modal
    const editCell = this.params.api.getEditingCells();
    if (keyCode === KEY_TAB) {
      this.focusCellIndex = focusCell.rowIndex;
      if (editCell && editCell.length && editCell[0].column.colId === 'qty') {
        this.params.api.tabToPreviousCell();
        const row = this.params.api.getDisplayedRowAtIndex(editCell[0].rowIndex);
        this.searchPartInfo({partsCode: row.data.partsCode, orderTypeId: this.form.value.orderTypeId});
      }
    }

    // Add new row with hot keys
    if (keyCode === KEY_DOWN) {
      if (focusCell.rowIndex === this.focusCellIndex && focusCell.rowIndex === this.displayedData.length - 1) {
        this.params.api.stopEditing();
        this.onAddRow();
      }
      if (focusCell.rowIndex === this.displayedData.length - 1) {
        this.focusCellIndex = focusCell.rowIndex;
      }
    }
    if (keyCode === KEY_UP) {
      this.focusCellIndex = focusCell.rowIndex;
    }
  }

  searchPartInfo(val) {
    this.loadingService.setDisplay(true);
    this.partsManualOrderApi.searchPartForNewOrder(val).subscribe(partsInfoData => {
      this.loadingService.setDisplay(false);
      if (partsInfoData.list.length === 1) {
        this.setDataToRow(partsInfoData.list[0]);
      } else {
        this.searchDataGridModal.open(val, partsInfoData.list, partsInfoData.total);
      }
    });
  }

  get validateBeforeAddRow() {
    const fieldToCheck = {name: 'Mã phụ tùng', field: 'partsId'};
    const lexusCheckCondition: CheckingLexusPartModel = {
      dataArr: this.displayedData,
      dlrLexusOfCurrentDlr: this.dlrLexusOfCurrentDlr,
      gridParams: this.params,
      fieldToFocus: 'partsCode'
    };
    return !(!this.agDataValidateService.checkRequiredHiddenFields(this.params, this.displayedData, fieldToCheck)
      || !this.agDataValidateService.validateDataGrid(this.params, this.fieldGrid, this.displayedData)
      || (this.form.value.orderTypeId !== 13 && !this.partsManagementService.validateLexusPart(lexusCheckCondition))
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
      mad: undefined,
      onHandQty: undefined,
      onOrderQty: undefined,
      mip: undefined,
      suggestOrderQty: undefined,
      cpd: undefined,
      spd: undefined,
      maxAllocate: undefined,
      qty: undefined,
      boQty: undefined,
      price: undefined,
      sumPrice: undefined,
      rate: undefined
    };
    this.params.api.updateRowData({add: [blankPart]});
    this.getDisplayedData();
    this.gridTableService.setFocusCell(this.params, 'partsCode', this.displayedData);
  }

  // DELETE SELECTED ROW
  removeSelectedRow() {
    if (!this.selectedPart) {
      this.toastService.openWarningToast('Bạn chưa chọn phụ tùng, hãy chọn một phụ tùng để xóa');
      return;
    }
    this.gridTableService.removeSelectedRow(this.params, this.selectedPart);
    this.selectedPart = undefined;
    this.getDisplayedData();
  }

  // SET DATA TO ROW
  setDataToRow(rowData) {
    const fieldToCheck = {name: 'Mã phụ tùng', field: 'partsId'};
    const rowIndex = this.displayedData.indexOf(this.selectedPart);
    const val = {
      stt: rowIndex + 1,
      partsCode: rowData.partsCode,
      partsName: rowData.partsName,
      unit: rowData.unit,
      mad: rowData.mad,
      dad: rowData.dad,
      onHandQty: rowData.onHandQty,
      onOrderQty: rowData.onOrderQty,
      mip: rowData.mip,
      suggestOrderQty: rowData.suggestOrderQty,
      cpd: rowData.cpd,
      spd: rowData.spd,
      maxAllocate: rowData.maxAllocate,
      qty: 0,
      boQty: rowData.boQty,
      price: rowData.price,
      sumPrice: 0,
      rate: rowData.rate,

      id: null,
      partsId: rowData.partsId,
      frCd: rowData.frCd
    };
    if (!this.agDataValidateService.checkDuplicateData(val, this.displayedData, fieldToCheck)) {
      this.editingRowParams.node.setDataValue(this.editingRowParams.colDef.field, this.editingRowParams.column.editingStartedValue);
      this.gridTableService.setFocusCell(this.params, this.fieldGrid[0].children[1].field, this.gridTableService.getAllData(this.params));
      return;
    }
    this.gridTableService.setDataToRow(this.params, rowIndex, val, this.displayedData, 'qty');
    this.selectedPart = val;
    this.getDisplayedData();
  }

  viewOrder() {
    this.submitFormBtn.nativeElement.click();
    if (this.form.invalid) {
      return;
    }
    this.getDisplayedData();
    if (this.displayedData.length === 0) {
      this.toastService.openWarningToast('Danh sánh phụ tùng trống, hãy nhập ít nhất một phụ tùng để đặt hàng', 'Cảnh báo');
      return;
    }
    if (!this.validateBeforeAddRow) {
      return;
    }

    this.partsManualCheckingModal.open(this.form.getRawValue(), this.displayedData);
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

  selectPackOfParts() {
    const packOfPartsOrder = this.orderMethodArr.find(orderType => orderType.orderMCode === 'K');
    if (!packOfPartsOrder || (packOfPartsOrder && this.form.value.orderTypeId !== packOfPartsOrder.id)) {
      this.toastService.openWarningToast('Chỉ dùng cho loại đơn hàng là Bộ linh kiện');
      return;
    }
    this.selectPackOfPartsModal.open();
  }

  private buildForm() {
    const newDate = new Date().getTime();
    this.form = this.formBuilder.group({
      orderNo: [{value: undefined, disabled: true}],
      orderDateView: [{value: this.dataFormatService.parseTimestampToFullDate(newDate), disabled: true}],
      orderDate: [newDate],
      orderPersonId: [{value: this.currentUser.userName, disabled: true}],
      transportTypeId: [undefined],
      orderTypeId: [this.orderMethodArr.length > 0 ? this.orderMethodArr[0].id : null]
    });
    this.currentOrderTypeId = this.form.value.orderTypeId;
    if (this.selectedOrder) {
      this.form.patchValue(this.selectedOrder);
    }
    this.form.get('orderTypeId').valueChanges.subscribe(val => {
      if (val && this.currentOrderTypeId !== val && this.displayedData.length) {
        this.confirmService.openConfirmModal('Cảnh báo',
          'Thay đổi "Loại ĐH" sẽ làm mất toàn bộ phụ tùng đã nhập, bạn có muốn tiếp tục?')
          .subscribe(() => {
            this.displayedData = [];
            this.params.api.setRowData(this.displayedData);
            this.onAddRow();
            this.currentOrderTypeId = this.form.value.orderTypeId;
          }, () => this.form.patchValue({orderTypeId: this.currentOrderTypeId}));
      }
    });
  }

  order() {
    this.eventBus.emit({
      type: 'newManualTabOrder',
      selectOrder: this.selectedOrder
    });
    this.resetForm();
  }

  resetForm() {
    this.buildForm();
    this.params.api.setRowData([]);
    this.getDisplayedData();
  }

}
