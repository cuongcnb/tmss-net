import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {PaginationParamsModel} from '../../core/models/base.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'grid-table-sale',
  templateUrl: './grid-table-sale.component.html',
  styleUrls: ['./grid-table-sale.component.scss']
})
export class GridTableSaleComponent implements OnInit, OnChanges {
  @ViewChild('agGrid', {static: false}) agGrid;

  @Input() enterToSearch = false;
  @Input() detailCellRendererParams;
  @Input() rowClassRules;
  @Input() masterDetail;
  @Input() paginationTotalsData: number;
  @Input() isResizeColumnToHeaderWidth = false;
  @Input() detailRowHeight;
  @Input() suppressRowClickSelection;
  @Input() paginationPageSize;
  @Input() showPagination = true;
  @Input() fieldGrid: object;
  @Input() rowGroupPanelShow: string;
  @Input() height;
  @Input() overlayLoadingTemplate: string;
  @Input() frameworkComponents;
  @Input() showSelectPagination = true;
  @Input() groupMultiAutoColumn: boolean;
  @Input() morePageSize: boolean;
  @Input() excelStyles;
  @Input() checkedData;

  @Output() getParams = new EventEmitter();
  @Output() callbackGrid = new EventEmitter();
  @Output() cellClicked = new EventEmitter();
  @Output() cellDoubleClicked = new EventEmitter();
  @Output() cellEditingStopped = new EventEmitter();
  @Output() changePaginationParams = new EventEmitter();
  @Output() cellMouseOver = new EventEmitter();
  @Output() cellMouseOut = new EventEmitter();
  @Output() cellMouseDown = new EventEmitter();
  @Output() cellValueChanged = new EventEmitter();
  params;
  paginationParams: PaginationParamsModel;
  totalData: number;
  isHaveOwnerTotals = true;

  style = {
    height: '100%'
  };
  defaultColDef = {
    editable: false,
    filter: 'agTextColumnFilter',
    filterParams: {
      caseSensitive: false,
      applyButton: this.enterToSearch
    },
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    cellClass: ['cell-border', 'stringType'],
    sortable: true,
    resizable: true
  };

  constructor() {
  }

  setHeight(height) {
    this.style = {height};
  }

  onSelectionChanged(params) {
    return this.getParams.emit(params);
  }

  renderData(params) {
    this.params = params;
    if (!params.columnApi.getAllColumns()) {
      return this.callbackGrid.emit(params);
    }

    if (this.isResizeColumnToHeaderWidth || params.columnApi.getAllColumns().length > 10) {
      this.sizeColumnToHeaderWidth(params);
    } else {
      this.sizeColumnToScreenSize(params);
    }
    return this.callbackGrid.emit(params);
  }

  copyCell($event: KeyboardEvent) {
    // if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 67) {
    //   const selBox = document.createElement('textarea');
    //   selBox.style.opacity = '0';
    //   selBox.value = this.params.api.getSelectedRows()[0][this.params.api.getFocusedCell().column.colId];
    //   document.body.appendChild(selBox);
    //   selBox.focus();
    //   selBox.select();
    //   document.execCommand('copy');
    //   document.body.removeChild(selBox);
    // }
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

  sizeColumnToScreenSize(params) {
    const allColumnIds = [];
    params.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    });
  }

  sizeColumnToHeaderWidth(params) {
    const allColumnIds = [];
    params.columnApi.getAllColumns().forEach(column => {
      allColumnIds.push(column.colId);
    });
    setTimeout(() => {
      params.columnApi.autoSizeColumns(allColumnIds);
    });
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
      // tslint:disable-next-line:forin
      for (const key in filterVal) {
        arr.push({
          fieldFilter: key,
          filterValue: filterVal[key].filter
        });
      }
      this.paginationParams.filters = arr;
      this.paginationParams.page = 1;
      this.changePaginationParams.emit(this.paginationParams);
    } else {
      this.paginationParams.filters = [];
      this.paginationParams.page = 1;
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
    if (this.height) {
      this.setHeight(this.height);
    } else {
      this.setHeight('350px');
    }
    if (!this.overlayLoadingTemplate) {
      this.overlayLoadingTemplate = ' ';
    }
    this.defaultColDef.filterParams.applyButton = this.enterToSearch;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isHaveOwnerTotals = true;
    this.totalData = this.paginationTotalsData;
    this.paginationParams = {
      sortType: null,
      page: 1,
      size: this.paginationParams ? this.paginationParams.size : 20,
      filters: [],
      fieldSort: null
    };
  }

  cellClickedEvent(params) {
    this.cellClicked.emit(params);
  }

  cellDoubleClickedEvent(params) {
    this.cellDoubleClicked.emit(params);
  }

  onCellMouseOver(params) {
    this.cellMouseOver.emit(params);
  }

  onCellMouseOut(params) {
    this.cellMouseOut.emit(params);
  }

  onCellMouseDown(params) {
    this.cellMouseDown.emit(params);
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


}
