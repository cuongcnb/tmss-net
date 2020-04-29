import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {CurrentUserModel} from '../../../core/models/base.model';
import {CurrentUser} from '../../../home/home.component';
import {AgDataValidateService} from '../../../shared/ag-grid-table/ag-data-validate/ag-data-validate.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {OrderForLexusPartModel} from '../../../core/models/parts-management/order-for-lexus-part.model';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {OrderForLexusPartApi} from '../../../api/parts-management/order-for-lexus-part.api';
import {DownloadService} from '../../../shared/common-service/download.service';
import {DealerModel} from '../../../core/models/sales/dealer.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'order-for-lexus-part',
  templateUrl: './order-for-lexus-part.component.html',
  styleUrls: ['./order-for-lexus-part.component.scss']
})
export class OrderForLexusPartComponent implements OnInit {
  @ViewChild('searchDataGridModal', {static: false}) searchDataGridModal;
  form: FormGroup;
  currentUser: CurrentUserModel = CurrentUser;
  dlrLexusOfCurrentDlr: DealerModel;

  fieldGrid;
  params;
  selectedPart: OrderForLexusPartModel;
  displayedData: Array<OrderForLexusPartModel> = [];

  fieldGridSearchDataGrid;

  totalPriceBeforeTax: string;
  taxOnly: string;
  totalPriceIncludeTax: string;

  editingRowParams;
  currentOrderTypeId: number;
  focusCellIndex = 0;


  constructor(
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private agDataValidateService: AgDataValidateService,
    private gridTableService: GridTableService,
    private confirmService: ConfirmService,
    private orderForLexusPartApi: OrderForLexusPartApi,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private downloadService: DownloadService
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 80
      },
      {
        headerName: 'Mã phụ tùng',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        cellClass: ['cell-border', 'cell-clickable', 'partsCode'],
        validators: ['required'],
        editable: true
      },
      {
        headerName: 'Tên phụ tùng',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
        }
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit',
        cellClass: ['text-right', 'cell-border', 'cell-readonly']
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        cellClass: ['text-right', 'cell-border', 'cell-readonly'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'SL cần đặt',
        headerTooltip: 'Số lượng cần đặt',
        field: 'qty',
        validators: ['required', 'integerNumber'],
        cellClass: ['text-right', 'cell-border', 'cell-clickable'],
        editable: true
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'sumPrice',
        cellClass: ['text-right', 'cell-border', 'cell-readonly'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        cellClass: ['text-right', 'cell-border', 'cell-readonly']
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
    this.getLexusOfCurrentDealer();
  }

  searchPartApiCall(val, paginationParams?) {
    return this.orderForLexusPartApi.findPartForNewOrder({
      partsCode: val.partsCode || null,
      orderTypeId: val.orderTypeId || null
    }, paginationParams);
  }

  getLexusOfCurrentDealer() {
    this.loadingService.setDisplay(true);
    this.orderForLexusPartApi.getLexusOfCurrentDealer().subscribe(dlrLexusOfCurrentDlr => {
      this.loadingService.setDisplay(false);
      if (!dlrLexusOfCurrentDlr) {
        this.swalAlertService.openWarningToast('Không có quyền thực hiện chức năng này');
      }
      this.dlrLexusOfCurrentDlr = dlrLexusOfCurrentDlr;
      this.buildForm();
    });
  }

  // ****** AG GRID ******
  callbackGrid(params) {
    this.params = params;
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
        this.searchPartInfo({partsCode: params.value.replace(/[^a-zA-Z0-9]/g, '')});
        break;
      case 'qty':
        params.data.qty = parseFloat(params.data.qty);
        params.data.sumPrice = parseFloat(params.data.qty) * parseFloat(params.data.price);
        // if (params.rowIndex === this.gridTableService.getAllData(this.params).length - 1) {
        //   this.gridTableService.setFocusCell(this.params, this.fieldGrid[1].field, null, params.rowIndex);
        // }
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
      this.searchPartInfo({partsCode: srcElement.innerHTML, orderTypeId: this.form.value.orderTypeId});
    }
    const focusCell = this.params.api.getFocusedCell();

    // Press tab to search with modal
    const editCell = this.params.api.getEditingCells();
    if (editCell && editCell.length) {
      this.focusCellIndex = focusCell.rowIndex;
      if (keyCode === KEY_TAB && editCell[0].column.colId === 'qty') {
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
      this.focusCellIndex = focusCell.rowIndex;
    }
    if (keyCode === KEY_UP) {
      this.focusCellIndex = focusCell.rowIndex;
    }
  }

  searchPartInfo(val) {
    this.loadingService.setDisplay(true);
    this.orderForLexusPartApi.findPartForNewOrder(val).subscribe(partsInfoData => {
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
    return !(!this.agDataValidateService.checkRequiredHiddenFields(this.params, this.displayedData, fieldToCheck)
      || !this.agDataValidateService.validateDataGrid(this.params, this.fieldGrid, this.displayedData)
    );
  }

  onAddRow() {
    if (!this.dlrLexusOfCurrentDlr) {
      this.swalAlertService.openWarningToast('Đại lý không có quyền thực hiện chức năng này');
      return;
    }
    const lastIndex = this.params.api.getLastDisplayedRow();
    if (lastIndex >= 0) {
      const lastItem = this.params.api.getDisplayedRowAtIndex(lastIndex).data;
      if (!lastItem.partsCode) {
        this.swalAlertService.openWarningToast('Kiểm tra lại Mã PT');
        return;
      }
      if (!lastItem.price) {
        this.swalAlertService.openWarningToast('Bạn phải chọn phụ tùng trong danh sách');
        return;
      }
    }
    const blankPart = {
      stt: this.displayedData.length + 1,
      partsCode: undefined,
      partsName: undefined,
      unit: undefined,
      qty: undefined,
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
    if (!this.dlrLexusOfCurrentDlr) {
      this.swalAlertService.openWarningToast('Đại lý không có quyền thực hiện chức năng này');
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
      qty: 0,
      price: rowData.price,
      sumPrice: 0,
      rate: rowData.rate,

      id: null,
      partsId: rowData.partsId
    };
    const listPartCode = [];
    this.displayedData.forEach(it => listPartCode.push(it.partsCode));
    if (
      !this.agDataValidateService.checkDuplicateData(
        val,
        this.displayedData,
        fieldToCheck
      )
    ) {
      this.editingRowParams.node.setDataValue(
        this.editingRowParams.colDef.field,
        this.editingRowParams.column.editingStartedValue
      );
      this.gridTableService.setFocusCell(
        this.params,
        this.fieldGrid[1].field,
        this.gridTableService.getAllData(this.params)
      );
      return;
    }
    this.gridTableService.setDataToRow(this.params, rowIndex, val, this.displayedData, 'qty');
    this.selectedPart = val;
    this.getDisplayedData();
  }

  cancelSearchParts() {
    if (this.editingRowParams) {
      this.editingRowParams.node.setDataValue(this.editingRowParams.colDef.field, this.editingRowParams.column.editingStartedValue);
      this.editingRowParams.api.setFocusedCell(this.editingRowParams.rowIndex, this.editingRowParams.colDef.field);
    }
  }

  // SUBMIT DATA
  placeOrder() {
    // Validate
    if (!this.dlrLexusOfCurrentDlr) {
      this.swalAlertService.openWarningToast('Đại lý không có quyền thực hiện chức năng này');
      return;
    }
    if (this.form.invalid) {
      return;
    }
    this.getDisplayedData();
    if (this.displayedData.length === 0) {
      this.swalAlertService.openWarningToast('Danh sánh phụ tùng trống, hãy nhập ít nhất một phụ tùng để đặt hàng', 'Cảnh báo');
      return;
    }
    if (!this.validateBeforeAddRow) {
      return;
    }

    // Submit
    const val = Object.assign(this.form.getRawValue(), {
      parts: this.displayedData
    });
    this.loadingService.setDisplay(true);
    this.orderForLexusPartApi.placeOrder(val).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast(`Tạo thành công đơn hàng số ${res.lexordNo}`);
      this.displayedData = [];
      this.params.api.setRowData(this.displayedData);
      this.form.patchValue({
        orderNo: null,
        orderDateDisplay: this.dataFormatService.parseTimestampToFullDate(new Date().getTime()),
        orderToDlr: this.dlrLexusOfCurrentDlr.id,
        dlrRemark: null,
        orderDate: new Date().getTime()
      });
      this.downloadFile(res);
    });
  }

  private downloadFile(res) {
    this.loadingService.setDisplay(true);
    this.orderForLexusPartApi.downloadFile(res).subscribe(file => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(file);
    });
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

  private buildForm() {
    const toDayString = this.dataFormatService.parseTimestampToFullDate(new Date().getTime());
    this.form = this.formBuilder.group({
      orderNo: [{value: '', disabled: true}],
      orderDateDisplay: [{value: toDayString, disabled: true}],
      orderPerson: [{value: this.currentUser.userName, disabled: true}],
      orderToDlr: [{value: this.dlrLexusOfCurrentDlr ? this.dlrLexusOfCurrentDlr.id : '', disabled: true}],
      dlrRemark: [''],
      orderTypeId: [1],

      orderDate: [new Date().getTime()]
    });
    this.currentOrderTypeId = this.form.value.orderTypeId;
    const message = 'Thay đổi "Loại đặt hàng" sẽ làm mất toàn bộ phụ tùng đã nhập, bạn có muốn tiếp tục?';
    this.form.get('orderTypeId').valueChanges.subscribe(val => {
      if (val && this.currentOrderTypeId !== val && this.displayedData.length) {
        this.confirmService.openConfirmModal('Cảnh báo', message).subscribe(() => {
          this.displayedData = [];
          this.params.api.setRowData(this.displayedData);
          this.onAddRow();
          this.currentOrderTypeId = this.form.value.orderTypeId;
        }, () => {
          this.form.patchValue({
            orderTypeId: this.currentOrderTypeId
          });
        });
      }
    });
  }

}
