import {Component, EventEmitter, Input, OnInit, Output, ViewChild, Injector} from '@angular/core';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PartsOfSpecialOrder, PartsSpecialOrderModel} from '../../../../core/models/parts-management/parts-special-order.model';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {PartsSpecialOrderApi} from '../../../../api/parts-management/parts-special-order.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {PartsInfoManagementApi} from '../../../../api/parts-management/parts-info-management.api';
import {DealerModel} from '../../../../core/models/sales/dealer.model';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {TransportTypeApi} from '../../../../api/common-api/transport-type.api';
import {TransportTypeModel} from '../../../../core/models/common-models/transport-type.model';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {CurrentUserModel} from '../../../../core/models/base.model';
import {AgDataValidateService} from '../../../../shared/ag-grid-table/ag-data-validate/ag-data-validate.service';
import {ConfirmService} from '../../../../shared/confirmation/confirm.service';
import {OrderForLexusPartApi} from '../../../../api/parts-management/order-for-lexus-part.api';
import {CheckingLexusPartModel, PartsManagementService} from '../../parts-management.service';
import {forkJoin} from 'rxjs';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'create-special-order-modal',
  templateUrl: './new-special-order-modal.component.html',
  styleUrls: ['./new-special-order-modal.component.scss']
})
export class NewSpecialOrderModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('searchDataGridModal', {static: false}) searchDataGridModal;
  @ViewChild('partsSpecialCheckingModal', {static: false}) checkingModal;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Input() dealerList: Array<DealerModel>;
  dlrLexusOfCurrentDlr: DealerModel;
  modalHeight: number;
  selectedOrder: PartsSpecialOrderModel;
  partsOfOrderData: Array<PartsOfSpecialOrder>;
  // currentUser: CurrentUserModel;

  form: FormGroup;

  fieldGrid;
  params;
  selectedPart: PartsOfSpecialOrder;

  displayedData: Array<PartsOfSpecialOrder> = [];
  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  fieldGridSearchDataGrid;


  transportTypeList: Array<TransportTypeModel>;
  editingRowParams;
  focusCellIndex = 0;

  constructor(
    injector: Injector,
    private loadingService: LoadingService,
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private partsSpecialOrderApi: PartsSpecialOrderApi,
    private partsInfoManagementApi: PartsInfoManagementApi,
    // private formStoringService: FormStoringService,
    private transportTypeApi: TransportTypeApi,
    private gridTableService: GridTableService,
    private agDataValidateService: AgDataValidateService,
    private confirmService: ConfirmService,
    private orderForLexusPartApi: OrderForLexusPartApi,
    private partsManagementService: PartsManagementService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.onResize();
    this.currentUser = this.currentUser;
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        editable: params => {
          const index = this.partsOfOrderData.indexOf(params.data);
          return index === -1;
        },
        validators: ['required'],
        cellClass: params => {
          const index = this.partsOfOrderData.indexOf(params.data);
          if (index === -1) {
            return ['cell-clickable', 'cell-border', 'partsCode'];
          }
        }
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
        }
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit'
      },
      {
        headerName: 'SL',
        headerTooltip: 'Số lượng',
        field: 'qty',
        cellClass: ['cell-clickable', 'cell-border', 'text-right'],
        validators: ['required', 'integerNumber'],
        editable: true
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
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
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
      },
      {
        headerName: 'Tên xe',
        headerTooltip: 'Tên xe',
        field: 'car',
        editable: true,
        cellClass: ['cell-border']
      },
      {
        field: 'modelCode',
        editable: true,
        cellClass: ['cell-border']
      },
      {
        headerName: 'Số VIN',
        headerTooltip: 'Số VIN',
        field: 'vin',
        editable: true,
        cellClass: ['cell-border']
      },
      {
        headerName: 'Mã CK',
        headerTooltip: 'Mã CK',
        field: 'keyCode',
        editable: true,
        cellClass: ['cell-border']
      },
      {
        headerName: 'Số ghế',
        headerTooltip: 'Số ghế',
        field: 'seatNo',
        editable: true,
        cellClass: ['cell-border'],
        validators: ['integerNumber']
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'remark',
        editable: true,
        cellClass: ['cell-border']
      }
    ];
    this.fieldGridSearchDataGrid = [
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode'
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
        }
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit'
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate'
      }
    ];
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  masterApi() {
    this.loadingService.setDisplay(true);
    forkJoin([
      this.transportTypeApi.getAll(false),
      this.orderForLexusPartApi.getLexusOfCurrentDealer()
    ]).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.transportTypeList = res[0];
      this.dlrLexusOfCurrentDlr = res[1];
    });
  }

  searchPartApiCall(val, paginationParams?) {
    return this.partsInfoManagementApi.searchPartForSpecialOrder({partsCode: val.partsCode || null}, paginationParams);
  }

  open(selectedOrder?, partsOfOrderData?) {
    this.selectedOrder = selectedOrder ? selectedOrder : undefined;
    this.partsOfOrderData = partsOfOrderData ? partsOfOrderData : [];
    this.masterApi();
    this.buildForm();
    this.modal.show();
  }

  patchData() {
    if (this.selectedOrder && this.partsOfOrderData) {
      this.form.patchValue(this.selectedOrder);
      this.params.api.setRowData(this.partsOfOrderData);
      this.getDisplayedData();
      if (this.partsOfOrderData.length > 0) {
        this.gridTableService.setFocusCell(this.params, 'partsCode', this.displayedData, 0);
      }
    }
  }

  reset() {
    this.form = undefined;
    this.selectedOrder = undefined;
    this.displayedData = [];
    this.calculateFooterDetail();
  }

  // ****** AG GRID *******
  callBackGridPartsOfOrder(params) {
    this.params = params;
    this.patchData();
  }

  getParamsPartsOfOrder() {
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
        // this.searchPartInfo({partsCode: params.value.replace(/[^a-zA-Z0-9]/g, '')});
        break;
      case 'qty':
        params.data.qty = parseFloat(params.data.qty);
        params.data.sumPrice = parseFloat(params.data.qty) * parseFloat(params.data.price);

        if (params.rowIndex === this.gridTableService.getAllData(this.params).length - 1) {
          this.gridTableService.setFocusCell(this.params, this.fieldGrid[1].field, null, params.rowIndex);
        }
        break;
      case 'seatNo':
        params.data.seatNo = params.data.seatNo ? parseFloat(params.data.seatNo) : null;
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

    // Press enter to search with modal
    if (srcElement.classList.contains('partsCode') && keyCode === KEY_ENTER) {
      this.searchPartInfo({partsCode: srcElement.innerHTML});
    }
    const focusCell = this.params.api.getFocusedCell();

    if (keyCode === KEY_TAB) {
      this.focusCellIndex = focusCell.rowIndex;
    }
    // Press tab to search with modal
    const editCell = this.params.api.getEditingCells();
    if (editCell && editCell.length) {
      this.focusCellIndex = focusCell.rowIndex;
      if (keyCode === KEY_TAB && editCell[0].column.colId === 'qty') {
        this.params.api.tabToPreviousCell();
        const row = this.params.api.getDisplayedRowAtIndex(editCell[0].rowIndex);
        this.searchPartInfo({partsCode: row.data.partsCode});
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
    this.partsInfoManagementApi.searchPartForSpecialOrder(val).subscribe(partsInfoData => {
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
    const fieldToCheck = {name: 'Mã phụ tùng', field: 'partsId'};
    const lexusCheckCondition: CheckingLexusPartModel = {
      dataArr: this.displayedData,
      dlrLexusOfCurrentDlr: this.dlrLexusOfCurrentDlr,
      gridParams: this.params,
      fieldToFocus: 'partsCode'
    };
    return !(!this.agDataValidateService.checkRequiredHiddenFields(this.params, this.displayedData, fieldToCheck)
      || !this.agDataValidateService.validateDataGrid(this.params, this.fieldGrid, this.displayedData)
      || !this.partsManagementService.validateLexusPart(lexusCheckCondition)
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
      qty: undefined,
      unitPrice: undefined,
      sumPrice: undefined,
      rate: undefined,
      modelCode: undefined,
      car: undefined,
      vin: undefined,
      keyCode: undefined,
      seatNo: undefined,
      remark: undefined
    };
    this.params.api.updateRowData({add: [blankPart]});
    this.getDisplayedData();
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
        this.partsSpecialOrderApi.deletePartOfOrder(this.selectedOrder.id, this.selectedPart.id).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.removeSelectedRow();
        });
      }, () => {
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
    const fieldToCheck = {name: 'Mã phụ tùng', field: 'partsId'};
    const rowIndex = this.displayedData.indexOf(this.selectedPart);
    const val = {
      id: null,
      stt: rowIndex + 1,
      partsCode: rowData.partsCode,
      partsName: rowData.partsName,
      unit: rowData.unit,
      unitId: rowData.unitId,
      price: rowData.price,
      rate: rowData.rate,
      qty: 0,
      partsId: rowData.id,
      sumPrice: 0,
      car: null,
      modelCode: null,
      vin: null,
      keyCode: null,
      seatNo: null,
      remark: null,
      dlrId: CurrentUser.dealerId,
      frCd: rowData.frCd,
      specialOrderId: null
    };
    if (!this.agDataValidateService.checkDuplicateData(val, this.displayedData, fieldToCheck)) {
      this.editingRowParams.node.setDataValue(this.editingRowParams.colDef.field, this.editingRowParams.column.editingStartedValue);
      this.gridTableService.setFocusCell(this.params, this.fieldGrid[1].field, this.gridTableService.getAllData(this.params));
      return;
    }
    this.gridTableService.setDataToRow(this.params, rowIndex, val, this.displayedData, 'qty');
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

    this.checkingModal.open(this.form.getRawValue(), this.displayedData, this.selectedOrder);
    // Submit
    // const orderData = Object.assign({}, {
    //   order: this.form.value,
    //   parts: this.displayedData
    // });
    // const apiCall = this.selectedOrder ?
    //   this.partsSpecialOrderApi.updateOrder(orderData) :
    //   this.partsSpecialOrderApi.create(orderData);
    // this.loadingService.setDisplay(true);
    // apiCall.subscribe(res => {
    //   this.loadingService.setDisplay(false);
    //   this.swalAlertService.openSuccessToast(`${this.selectedOrder ? 'Cập nhật thành công đơn hàng:' : 'Tạo mới đơn hàng thành công:'} ${res.speordNo}`);
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
      id: [undefined],
      orderNo: [{value: undefined, disabled: true}],
      receiveDlrId: [{value: undefined, disabled: !this.currentUser.isLexus}],
      remark: [undefined],
      remarkTmv: [{value: undefined, disabled: ![-2, -1].includes(this.currentUser.dealerId)}],
      status: [{value: 1, disabled: true}, GlobalValidator.required],
      transportTypeId: [1]
    });
    if (this.selectedOrder) {
      this.form.patchValue(this.selectedOrder);
    }
  }
}
