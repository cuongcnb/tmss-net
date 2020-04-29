import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {PaginationParamsModel} from '../../core/models/base.model';
import {ToastService} from '../swal-alert/toast.service';
import {GridTableService} from '../common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss']
})
export class GridTableComponent implements OnInit, OnChanges {
  @ViewChild('agGrid', {static: false}) agGrid;
  @Input() enterToSearch = false;
  @Input() isResizeColumnToHeaderWidth = false;
  @Input() enableFilter: boolean;
  @Input() groupSelectsChildren: boolean;
  @Input() getRowHeight;
  @Input() detailCellRendererParams;
  @Input() rowClassRules;
  @Input() tenTotal;
  @Input() addTotallk;
  @Input() disablePagination;
  @Input() rowMultiSelectWithClick;
  @Input() rowSelection = 'single';
  @Input() ignoreFitColumn: boolean;
  @Input() masterDetail;
  @Input() paginationTotalsData: number;
  @Input() detailRowHeight;
  @Input() suppressRowClickSelection: boolean;
  @Input() paginationPageSize;
  @Input() showPagination = true;
  @Input() fieldGrid;
  @Input() footerFieldGrid;
  @Input() isSuppressHorizontalScroll: boolean;
  @Input() footerData: object;
  @Input() rowGroupPanelShow: string;
  @Input() enableRangeSelection: boolean;
  @Input() enableCellChangeFlash: boolean;
  @Input() height;
  @Input() paginationParamsChanged: PaginationParamsModel;
  @Input() overlayLoadingTemplate: string;
  @Input() frameworkComponents;
  @Input() excelStyles;
  @Input() editType;
  @Input() headerHeight;
  @Input() groupHeaderHeight;
  @Input() checkedField = false;
  @Input() checkedData;
  @Input() tabToNextCell;
  @Input() navigateToNextCell;
  @Input() suppressHorizontalScroll = true;
  @Input() sizeColumnToHeaderWidth = false;
  @Input() groupMultiAutoColumn: boolean;
  @Output() getParams = new EventEmitter();
  @Output() callbackGrid = new EventEmitter();
  @Output() callbackFooterGrid = new EventEmitter();
  @Output() cellClicked = new EventEmitter();
  @Output() cellMouseDown = new EventEmitter();
  @Output() cellDoubleClicked = new EventEmitter();
  @Output() cellEditingStopped = new EventEmitter();
  @Output() cellEditingStarted = new EventEmitter();
  @Output() cellValueChanged = new EventEmitter();
  @Output() rowValueChanged = new EventEmitter();
  @Output() cellFocused = new EventEmitter();
  @Output() changePaginationParams = new EventEmitter();
  @Output() rowClicked = new EventEmitter();
  @Output() cellKeyPress = new EventEmitter();
  @Output() rowSelected = new EventEmitter();
  // tslint:disable-next-line:no-output-native
  @Output() keyup = new EventEmitter();
  @Input() morePageSize: boolean;
  @Input() autoGroupColumnDef;
  @Input() groupDefaultExpanded;
  @Input() groupSelectsFiltered;
  @Input() noSizeColumn;

  private readonly MOUSEOVER_SHOW_TOOLTIP_TIMEOUT = 100;


  footerParams;
  params;
  topOptions = {alignedGrids: []};
  bottomOptions = {alignedGrids: []};
  paginationParams: PaginationParamsModel;
  totalData: number;
  isHaveOwnerTotals = true;

  style = {
    height: '100%'
  };
  defaultColDef = {
    editable: false,
    resizable: true,
    tooltipValueGetter: (t: any) => t.value,
    filter: 'agTextColumnFilter',
    filterParams: {
      caseSensitive: true,
      applyButton: this.enterToSearch
    },
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    cellClass: ['cell-border', 'cell-readonly'],
    cellStyle: params => {
      if (params.colDef.field === 'stt') {
        return {textAlign: 'center'};
      }
    }
  };
  processCellForClipboard;

  constructor(private swalAlertService: ToastService,
              private gridTableService: GridTableService) {
    this.processCellForClipboard = (params) => {
      const focusedCell = this.params.api.getFocusedCell();

      if (params && focusedCell && params.column && focusedCell.column && focusedCell.column.colId === params.column.colId) {
        const rowNode1 = this.params.api.getDisplayedRowAtIndex(focusedCell.rowIndex);
        // let data;
        // this.params.api.forEachNode(node => {
        //   if (focusedCell.rowIndex === node.rowIndex) {
        //     data = node.data;
        //   }
        // });
        // console.log(data)
        return rowNode1.data ? rowNode1.data[`${focusedCell.column.colId}`] : '';
      }
      return;
    };
  }

  setHeight(height) {
    this.style = {height};
  }


  onSelectionChanged(params) {
    return this.getParams.emit(params);
  }

  renderData(params) {
    this.params = params;
    (params.api as any).context.beanWrappers.tooltipManager.beanInstance.MOUSEOVER_SHOW_TOOLTIP_TIMEOUT = this.MOUSEOVER_SHOW_TOOLTIP_TIMEOUT;
    if (!params.columnApi.getAllColumns()) {
      return this.callbackGrid.emit(params);
    }
    if (!this.ignoreFitColumn) {
      this.sizeColumnsToFit(params);
    }
    setTimeout(() => {
      if (this.isResizeColumnToHeaderWidth || params.columnApi.getAllColumns().length > 10) {
        this.sizeColumnToHeader(params);
      } else {
        this.sizeColumnToScreenSize(params);
      }
    }, 0);
    // this.gridTableService.autoSizeColumn(this.params, 'autoSizeColumn');
    return this.callbackGrid.emit(params);
  }

  sizeColumnToHeader(params) {
    // const allColumnIds = [];
    // params.columnApi.getAllColumns().forEach(column => {
    //   allColumnIds.push(column.colId);
    // });
    // setTimeout(() => {
    //   console.log(allColumnIds)
    //   params.columnApi.autoSizeAllColumns(allColumnIds);
    // });
  }

  sizeColumnToScreenSize(params) {
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    });
  }

  renderFooterData(params) {
    this.footerParams = params;
    if (!params.columnApi.getAllColumns()) {
      return this.callbackFooterGrid.emit(params);
    }

    if (!this.ignoreFitColumn) {
      this.sizeColumnsToFit(params);
    }
    return this.callbackFooterGrid.emit(params);
  }

  onKeyUp($event: KeyboardEvent) {
    this.keyup.emit($event);
    const KEY_UP = 'ArrowUp';
    const KEY_DOWN = 'ArrowDown';

    // select dòng nếu bấm nút lên hoặc xuống
    if (!this.suppressRowClickSelection) {
      const focusCell = this.params.api.getFocusedCell();
      if ($event.code === KEY_DOWN) {
        this.params.api.forEachNode((node) => {
          if (focusCell.rowIndex === node.rowIndex) {
            node.setSelected(true);
          }
        });
      }
      if ($event.code === KEY_UP) {
        this.params.api.forEachNode((node) => {
          if (focusCell.rowIndex === node.rowIndex) {
            node.setSelected(true);
          }
        });
      }
    }
  }

  onKeyDown($event) {
    // Copy Cell
    if (($event.ctrlKey || $event.metaKey) && $event.code === 'KeyC') {
      const selBox = document.createElement('textarea');
      selBox.style.opacity = '0';
      selBox.value = $event.target.innerHTML;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }
  }

  onColumnResized(event) {
    if (event.finished) {
      this.params.api.resetRowHeights();
    }
  }

  focus(event) {
  }

  sizeColumnsToFit(params) {
    const allColumnIds = [];
    params.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    setTimeout(() => {
      if (this.sizeColumnToHeaderWidth) {
        params.columnApi.autoSizeColumns(allColumnIds);
      } else {
        params.api.sizeColumnsToFit(params);
      }
    }, 0);
  }

  onSortChanged(event) {
    const change = event.api.getSortModel()[0];
    this.paginationParams.fieldSort = change ? change.colId : null;
    this.paginationParams.sortType = change ? change.sort : null;
    this.changePaginationParams.emit(this.paginationParams);
  }

  get totalPages() {
    return Math.ceil(this.totalData / this.paginationParams.size);
  }

  filterModified(event) {
    const filterVal = event.api.getFilterModel();

    if (filterVal) {
      const arr = [];
      for (const key in filterVal) {
        if (filterVal.hasOwnProperty(key)) {
          arr.push({
            fieldFilter: key,
            filterValue: filterVal[key].filter
          });
        }
      }

      this.paginationParams.filters = arr;
      this.changePaginationParams.emit(this.paginationParams);
    } else {
      this.paginationParams.filters = [];
      this.changePaginationParams.emit(this.paginationParams);
    }
  }

  onPaginationChanged(event) {
    if (!this.paginationTotalsData && this.params) {
      this.totalData = this.params.api.paginationGetRowCount();
      this.paginationParams.page = this.totalPages <= this.paginationParams.page ? this.totalPages : this.paginationParams.page;
      this.isHaveOwnerTotals = false;
    }
    if (this.params && !event.newData && event.newPage && !event.keepRenderedRows) {
      this.paginationParams.page = this.params.api.paginationGetCurrentPage() + 1;
      this.changePaginationParams.emit(this.paginationParams);
    }
  }

  ngOnInit() {
    this.topOptions.alignedGrids.push(this.bottomOptions);
    this.bottomOptions.alignedGrids.push(this.topOptions);
    if (this.height) {
      this.setHeight(this.height);
    } else {
      this.setHeight('500px');
    }
    if (!this.overlayLoadingTemplate) {
      this.overlayLoadingTemplate = 'Chưa có bản ghi nào';
    }
    this.defaultColDef.filterParams.applyButton = this.enterToSearch;
  }

  ngOnChanges() {
    this.isHaveOwnerTotals = true;
    this.totalData = this.paginationTotalsData;

    if (this.paginationParamsChanged) {
      this.paginationParams = this.paginationParamsChanged;
    } else {
      this.paginationParams = {
        page: 1,
        size: this.paginationParams && this.paginationParams.size ? this.paginationParams.size : this.tenTotal ? 10 : 20,
        sortType: null,
        filters: [],
        fieldSort: null
      };
    }

    if (this.footerData && !this.footerFieldGrid) {
      this.footerFieldGrid = this.fieldGrid.map(item => {
        return {...item, cellClass: ['cell-border']};
      });
    }
    if (this.params && !this.sizeColumnToHeaderWidth && !this.noSizeColumn) {
      this.params.api.sizeColumnsToFit(this.params);
    }
  }

  cellClickedEvent(params) {
    this.cellClicked.emit(params);
  }

  cellMouseDownEvent(params) {
    this.cellMouseDown.emit(params);
  }

  cellDoubleClickedEvent(params) {
    this.cellDoubleClicked.emit(params);
  }

  onCellFocused(params) {
    this.cellFocused.emit(params);
  }

  onCellKeyPress(params) {
    this.cellKeyPress.emit(params);
  }

  onCellEditingStopped(params) {
    this.cellEditingStopped.emit(params);
  }

  onCellEditingStarted(params) {
    params.column.editingStartedValue = params.value;
    this.cellEditingStarted.emit(params);
  }

  onCellValueChanged(params) {
    if (this.checkedData) {
      this.checkedValueChange(params);
    }
    const validators = params.colDef.validators;
    if (!params.colDef.validateOnSubmit && (validators && validators.length > 0)) {
      for (let i = 0, length = validators.length; i < length; i++) {
        if (this[`${validators[i]}Validate`].call(this, params)) {
          return;
        }
      }
    }
    if (params.colDef.field !== 'checked') {
      this.cellValueChanged.emit(params);
    }
  }

  checkedValueChange(params) {
    let index;
    if (params.api.getColumnDef('checked')) {
      index = params.api.getColumnDef('checked').fieldCheck;
    }
    if (params.data.checked) {
      this.checkedData[params.data[index]] = params.data;
    } else if (this.checkedData[params.data[index]]) {
      delete this.checkedData[params.data[index]];
    }
  }

  onRowValueChanged(params) {
    this.rowValueChanged.emit(params);
  }

  resetAfterEdit(params) {
    // params.node.setDataValue(params.colDef.field, params.column.editingStartedValue);
    // params.api.setFocusedCell(params.rowIndex, params.colDef.field);
  }

  focusAfterEdit(params) {
    setTimeout(() => {
      params.api.setFocusedCell(params.rowIndex, params.colDef.field);
      // params.api.startEditingCell({
      //   rowIndex: params.rowIndex,
      //   colKey: params.colDef.field
      // });
    }, 300);
  }

  requiredValidate(params) {
    if (params.column.editingStartedValue && (!params.value || !params.value.toString())) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Dữ liệu không được trống');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  numberValidate(params) {
    if (params.value !== '' && ((params.value && Number(params.value) !== 0 && !Number(params.value)))) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Sai định dạng số');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  integerNumberValidate(params) {
    const NUMBER_REGEX = /^\d+$/g;
    if (params.value !== '' && (params.value && !NUMBER_REGEX.test(params.value))) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Chỉ được nhập số nguyên');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }


  notNegativeNumberValidate(params) {
    if (params.value !== '' && (params.value && Number(params.value) < 0)) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Không thể là số âm');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  positiveNumberValidate(params) {
    const NUMBER_REG = /^\d+$/g;
    if (params.value !== '' && ((params.value && Number(params.value) <= 0) || !NUMBER_REG.test(params.value))) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Phải là nguyên số dương');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  notNagetiveIntNumberValidate(params) {
    const NUMBER_REG = /^\d+$/g;
    if (params.value !== '' && ((params.value && Number(params.value) < 0) || !NUMBER_REG.test(params.value))) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Phải là số nguyên không âm');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  intNumberValidate(params) {
    const NUMBER_REG = /^([+-]?[1-9]\d*|0)$/;
    if (params.value !== '' && !NUMBER_REG.test(params.value)) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Phải là số nguyên');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  floatNumberValidate(params) {
    // Accept both negative and positive float number
    const NUMBER_REG = /^-?\d+(\.\d{0,2})?$/g;
    if (params.value !== '' && (params.value && !NUMBER_REG.test(params.value))) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Không đúng định dạng số (Mẫu: 2.54)');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  floatPositiveNumValidate(params) {
    // Accept 0 and positive float number
    const NUMBER_REG = /^(?=.*[0-9])\d*(?:\.\d{1,2})?$/g;
    if (params.value !== '' && (params.value && !NUMBER_REG.test(params.value))) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Không đúng định dạng số (Mẫu: 2.54)');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  floatPositiveNum1Validate(params) {
    // Accept only float numbers that are greater than 0
    const NUMBER_REG = /^(?=.*[1-9])\d*(?:\.\d{1,2})?$/g;
    if (params.value !== '' && (params.value && !NUMBER_REG.test(params.value))) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Yêu cầu là số lơn hơn 0');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  emailValidate(params) {
    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (params.value && !EMAIL_REGEX.test(params.value)) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Dữ liệu không phải định dạng email');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  maxLengthValidate(params) {
    if (params.value && params.colDef.maxLength && params.value.length > params.colDef.maxLength) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast(`Độ dài tối đa là ${params.colDef.maxLength}`);
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  dupplicateValidate(params) {
    const dataList = this.gridTableService.getAllData(params).filter(item => item[params.colDef.field]).map(item => item[params.colDef.field]);
    for (let i = 1; i < dataList.length; i++) {
      const index = dataList.findIndex(data => data === dataList[i]);
      if (index !== i && params.rowIndex === i) {
        this.swalAlertService.openWarningToast('Dữ liệu bị trùng');
        this.focusAfterEdit(params);
        return true;
      }
    }
    return false;
  }

  phoneValidate(params) {
    const PHONE_REGEX = /^0[0-9]{9,10}$/g;
    if (params.value && !PHONE_REGEX.test(params.value)) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Dữ liệu không phải định dạng số điện thoại');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }

  peopleIdValidate(params) {
    if (params.value && params.value.toString().trim().length !== 9 && params.value.toString().trim().length !== 12) {
      this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Dữ liệu không phải định dạng số CMT');
      return true;
    }
    return false;
  }

  afterTodayValidate(params) {
    const isFirefox = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    const today = isFirefox ? new Date(Date.UTC(year, month, date, 23, 59, 59))
      : new Date(year, month, date, 23, 59, 59);
    if (params.value !== params.column.editingStartedValue && params.value <= today) {
      // this.resetAfterEdit(params);
      this.swalAlertService.openWarningToast('Ngày được chọn phải lớn hơn ngày hôm nay');
      this.focusAfterEdit(params);
      return true;
    }
    return false;
  }
}
