import {Component, ElementRef, OnDestroy, OnInit, Injector} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PartsLookupInfoApi} from '../../../api/parts-management/parts-lookup-info.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {CommonService} from '../../../shared/common-service/common.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {CurrentUserModel} from '../../../core/models/base.model';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {DealerModel} from '../../../core/models/sales/dealer.model';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import {remove} from 'lodash';
import {PartsLookupInfoModel, PartsLookupInfoPartSearchModel} from '../../../core/models/advisor/parts-lookup-info.model';
import {AgCheckboxRendererComponent} from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {map, startWith} from 'rxjs/operators';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { setFocusedCell, currentTab } from '@app/shared/common/focused-cells';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-lookup-info',
  templateUrl: './parts-lookup-info.component.html',
  styleUrls: ['./parts-lookup-info.component.scss']
})
export class PartsLookupInfoComponent extends AppComponentBase implements OnInit, OnDestroy {
  form: FormGroup;
  // currentUser: CurrentUserModel = CurrentUser;

  fieldGridSearch;
  selectedPartSearch;
  searchParams;
  displayedData: Array<PartsLookupInfoPartSearchModel>;

  fieldGridResult;
  resultParams;
  searchResultList: Array<PartsLookupInfoModel> = [];

  historyParams;
  searchHistoryList: Array<PartsLookupInfoModel> = [];
  frameworkComponents;

  fieldGridExport;
  exportParams;
  partListForExport: Array<PartsLookupInfoModel> = [];

  otherDealer: Array<DealerModel>;
  focusCellIndex = 0;

  params;
  selectedData: PartsLookupInfoModel;
  field = 'partLookup';

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private gridTableService: GridTableService,
    private partsSearchApi: PartsLookupInfoApi,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private dealerApi: DealerApi,
    private eventBus: EventBusService,
    private toastService: ToastService,
    private dataFormatService: DataFormatService,
    private elem: ElementRef
  ) {
    super(injector);
  }
  ngOnDestroy(): void {
    this.elem.nativeElement.removeEventListener('mousedown', (event) => {
    });
  }

  ngOnInit() {
    this.elem.nativeElement.addEventListener('mousedown', (event) => {
      const dataLocalStorage = localStorage.getItem(this.field);
      if (dataLocalStorage) {
        localStorage.removeItem(this.field);
      }
    });
    this.buildForm();
    this.getDealerList();
    this.fieldGridSearch = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        minWidth: 20,
        cellRenderer: params => params.rowIndex + 1
      },
      {
        headerName: 'Part Code',
        headerTooltip: 'Part Code',
        field: 'partsCode',
        validators: ['required', 'dupplicate'],
        editable: true,
        cellClass: 'partsCode'
      }
    ];
    this.fieldGridResult = [
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: '',
            headerTooltip: '',
            field: 'checkForExport',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            minWidth: 30
          },
          {
            headerName: 'STT',
            headerTooltip: 'Số thứ tự',
            field: 'stt',
            cellRenderer: params => params.rowIndex + 1,
            minWidth: 30
          },
          {
            headerName: 'Mã ĐL',
            headerTooltip: 'Mã đại lý',
            field: 'maDl',
            minWidth: 50
          },
          {
            headerName: 'Mã PT',
            headerTooltip: 'Mã phụ tùng',
            field: 'maPt',
            minWidth: 100
          },
          {
            headerName: 'Tên PT',
            headerTooltip: 'Tên phụ tùng',
            field: 'tenPt',
            minWidth: 150
          }
        ]
      },
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        children: [
          {
            headerName: 'Tồn',
            headerTooltip: 'Tồn',
            field: 'slTon',
            minWidth: 50,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Đ.dấu',
            headerTooltip: 'Đánh dấu',
            field: 'slDanhDau',
            minWidth: 50,
            cellClass: ['cell-border', 'text-right']
          }
        ]
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'O/H Firm',
            headerTooltip: 'O/H Firm',
            field: 'oHFOReceived',
            minWidth: 60
          },
          {
            headerName: 'SL ĐĐ',
            headerTooltip: 'Số lượng đang đặt',
            field: 'slDangDat',
            minWidth: 50,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'ĐVT',
            headerTooltip: 'Đơn vị tính',
            field: 'dvt',
            minWidth: 80
          },
          {
            headerName: 'Giá',
            headerTooltip: 'Giá',
            field: 'gia',
            minWidth: 80,
            cellClass: ['cell-border', 'text-right'],
            valueFormatter: params => this.dataFormatService.moneyFormat((params.value) ? params.value : 0)
          }
        ]
      },
      {
        headerName: 'Mã thay thế',
        headerTooltip: 'Mã thay thế',
        children: [
          {
            headerName: 'Cũ',
            headerTooltip: 'Cũ',
            field: 'maTtOld',
            minWidth: 80
          },
          {
            headerName: 'Mới',
            headerTooltip: 'Mới',
            field: 'maTt',
            minWidth: 80
          }
        ]
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'Xuất sứ',
            headerTooltip: 'Xuất sứ',
            field: 'coo',
            minWidth: 80
          },
          {
            headerName: 'Nhà CC',
            headerTooltip: 'Nhà cung cấp',
            field: 'nhaCc',
            minWidth: 80
          },
          {
            headerName: 'LT',
            headerTooltip: 'Lead Time',
            field: 'leadTime',
            minWidth: 40,
            cellClass: ['cell-border', 'text-right']
          }
        ]
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'Stop Sales',
            headerTooltip: 'Stop Sales',
            field: 'stopSalesCd',
            minWidth: 80,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Non Order',
            headerTooltip: 'Non Order',
            field: 'nonReorderCd',
            minWidth: 80,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Big Part',
            headerTooltip: 'Big Part',
            field: 'bigPartFg',
            minWidth: 80,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Dead Stock',
            headerTooltip: 'Dead Stock',
            field: 'deadstockQty',
            minWidth: 80,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Franchise Name',
            headerTooltip: 'Franchise Name',
            field: 'franchiseName',
            minWidth: 100,
            cellClass: ['cell-border', 'text-right']
          }
        ]
      }
    ];
    this.fieldGridExport = [
      {
        headerName: 'MA_DL',
        headerTooltip: 'MA_DL',
        field: 'maDl',
        minWidth: 80,
        cellClass: 'csvStringStartWithZero'
      },
      {
        headerName: 'MA_PT',
        headerTooltip: 'MA_PT',
        field: 'maPt',
        minWidth: 100,
        cellClass: 'csvStringStartWithZero'
      },
      {
        headerName: 'TEN_PT',
        headerTooltip: 'TEN_PT',
        field: 'tenPt',
        minWidth: 150
      },
      {
        headerName: 'SL_TON',
        headerTooltip: 'SL_TON',
        field: 'slTon',
        minWidth: 80,
        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'SL_DANH_DAU',
        headerTooltip: 'SL_DANH_DAU',
        field: 'slDanhDau',
        minWidth: 80,
        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'SL_DANG_DAT',
        headerTooltip: 'SL_DANG_DAT',
        field: 'slDangDat',
        minWidth: 80,
        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'DVT',
        headerTooltip: 'DVT',
        field: 'dvt',
        minWidth: 80
      },
      {
        headerName: 'GIA',
        headerTooltip: 'GIA',
        field: 'gia',
        minWidth: 80,
        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'PHI_CHUYEN_NHANH',
        headerTooltip: 'PHI_CHUYEN_NHANH',
        field: 'phiChuyenNhanh',
        minWidth: 80,
        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'THUE',
        headerTooltip: 'THUE',
        field: 'thue',
        minWidth: 80,
        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'NHA_CC',
        headerTooltip: 'NHA_CC',
        field: 'nhaCc',
        minWidth: 80
      },
      {
        headerName: 'LEAD_TIME',
        headerTooltip: 'LEAD_TIME',
        field: 'leadTime',
        minWidth: 80
      },
      {
        headerName: 'LEAD_TIME',
        headerTooltip: 'LEAD_TIME',
        field: 'leadTime',
        minWidth: 80
      },
      {
        headerName: 'MA_TT',
        headerTooltip: 'MA_TT',
        field: 'maTt',
        minWidth: 80
      },
      {
        headerName: 'MA_TT_MOI',
        headerTooltip: 'MA_TT_MOI',
        field: 'maTtOld',
        minWidth: 80
      },
      {
        headerName: 'STOP_SALE_CD',
        headerTooltip: 'STOP_SALE_CD',
        field: 'stopSalesCd',
        minWidth: 80,
        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'NON_REORDER_CD',
        headerTooltip: 'NON_REORDER_CD',
        field: 'nonReorderCd',
        minWidth: 80,
        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'DEADSTOCK_QTY',
        headerTooltip: 'DEADSTOCK_QTY',
        field: 'deadstockQty',
        minWidth: 80,
        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'FRANCHISE_NAME',
        headerTooltip: 'FRANCHISE_NAME',
        field: 'franchiseName',
        minWidth: 100,
        cellClass: ['cell-border', 'text-right']
      }
    ];
    this.frameworkComponents = {agCheckboxRendererComponent: AgCheckboxRendererComponent};
  }

  getDealerList() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers()
      .pipe(
        startWith([]),
        map(dealers => {
          this.loadingService.setDisplay(false);
          remove(dealers, (dealer: DealerModel) => dealer.id === this.currentUser.dealerId);
          remove(dealers, (dealer: DealerModel) => dealer.id === -1);
          remove(dealers, (dealer: DealerModel) => dealer.id === -2);
          return dealers;
        })
      ).subscribe(dealerList => this.otherDealer = dealerList);
  }

  // =====***** SEARCH PART GRID *****=====
  callbackSearch(params) {
    this.searchParams = params;
    this.onAddRow();
  }

  getParamsSearch() {
    const selectedPartSearch = this.searchParams.api.getSelectedRows();
    this.selectedPartSearch = selectedPartSearch ? selectedPartSearch[0] : this.selectedPartSearch;
  }

  agKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    const srcElement = event.target as HTMLInputElement;
    const keyCode = event.key;
    const KEY_UP = 'ArrowUp';
    const KEY_DOWN = 'ArrowDown';
    const KEY_ENTER = 'Enter';
    const focusCell = this.searchParams.api.getFocusedCell();
    const editingCells = this.searchParams.api.getEditingCells();
    const isEditing = !!editingCells.find(val => val.column.colId === focusCell.column.colId);
    // Add new row with hot keys
    if (keyCode === KEY_DOWN) {
      if (focusCell.rowIndex === this.displayedData.length - 1) {
        this.onAddRow();
      } else {
        this.gridTableService.setFocusCell(this.searchParams, focusCell.column.colId, null, focusCell.rowIndex + 1, isEditing);
      }
    }
    if (keyCode === KEY_UP) {
      this.focusCellIndex = focusCell.rowIndex === 0 ? 0 : focusCell.rowIndex - 1;
      this.gridTableService.setFocusCell(this.searchParams, focusCell.column.colId, null, this.focusCellIndex, isEditing);
    }

    if (srcElement.classList.contains('partsCode') && keyCode === KEY_ENTER) {
      this.search();
    }
  }

  // Add/Remove row
  onAddRow() {
    this.searchParams.api.updateRowData({add: [{partsCode: null}]});
    this.getDisplayedData();
    this.gridTableService.setFocusCell(this.searchParams, 'partsCode', this.displayedData);
  }

  removeSelectedRow() {
    this.gridTableService.removeSelectedRow(this.searchParams, this.selectedPartSearch);
  }

  // =====***** SEARCH RESULT GIRD *****=====
  callbackResult(params) {
    this.resultParams = params;
  }

  getParamsResult() {
  }


  search() {
    const partsSearchList = this.gridTableService.getAllData(this.searchParams)
      .filter(item => item.partsCode !== '')
      .map(item => item.partsCode);
    const dataSearch = Object.assign({}, this.form.value, {parts: partsSearchList});
    this.loadingService.setDisplay(true);
    this.partsSearchApi.searchParts(dataSearch).subscribe(val => {
      this.loadingService.setDisplay(false);
      this.searchHistoryList = [...this.searchHistoryList.length > 0 ? this.searchHistoryList : [], ...this.searchResultList.length > 0 ? this.searchResultList : []];
      this.searchHistoryList = this.commonService.removeDuplicateArrOfObj(this.searchHistoryList, 'maPt', 'maDl');
      this.historyParams.api.setRowData(this.searchHistoryList);
      this.searchResultList = val;
      this.resultParams.api.setRowData(this.searchResultList);
      this.resultParams.api.sizeColumnsToFit(this.resultParams);
    });
  }

  getParams() {
    const selectedData = this.resultParams.api.getSelectedRows();
    this.partListForExport = [];
    if (selectedData) {
      selectedData.forEach(it => this.partListForExport.push(it));
      this.selectedData = selectedData;
    }
  }

  // =====***** SEARCH HISTORY GIRD *****=====
  callbackHistory(params) {
    this.searchHistoryList = [];
    this.historyParams = params;
  }

  getParamsHistory() {
  }

  // OTHER BUTTONS
  clearSearchList() {
    this.searchParams.api.setRowData([]);
    this.onAddRow();

  }

  openCheckPriceCodeFunction() {
    this.eventBus.emit({
      type: 'openComponent',
      functionCode: 'HOI_MA_GIA_PT'
    });
  }

  clearSearchResult() {
    this.clearSearchList();
    this.searchHistoryList = [];
    this.historyParams.api.setRowData(this.searchHistoryList);
    this.searchResultList = [];
    this.resultParams.api.setRowData(this.searchResultList);
  }

  exportSearchResult() {
    if (this.partListForExport.length === 0) {
      this.toastService.openWarningToast('Bạn chưa chọn phụ tùng, hãy chọn ít nhất một phụ tùng để xuất dữ liệu', 'Cảnh báo');
      return;
    }
    const fileName = 'TraCuuThongTinPhuTung';
    // this.exportParams.api.setRowData(this.commonService.removeDupplicateArrOfObj(this.partListForExport, 'partsId'));
    this.exportParams.api.setRowData(this.partListForExport);
    this.gridTableService.export(this.exportParams, fileName, fileName, true);
  }

  private getDisplayedData() {
    this.displayedData = this.gridTableService.getAllData(this.searchParams);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      target: [100],
      dlrId: [undefined]
    });
    const dlrIdControl = this.form.controls.dlrId;
    dlrIdControl.disable();
    this.form.get('target').valueChanges.subscribe(val => {
      if (val === 103) {
        dlrIdControl.enable();
      } else {
        dlrIdControl.disable();
        dlrIdControl.patchValue(null);
      }
    });
  }

  cellEditingStopped(params) {

    window.onfocus = () => {
      // tslint:disable-next-line:no-shadowed-variable
      const data = JSON.parse(localStorage.getItem(this.field));
      if (data) {
        if (this.searchParams && data.colId) {
          this.gridTableService.setFocusCellDontEdit(this.searchParams, data.colId, Number(data.rowIndex));
          this.searchParams.api.clearFocusedCell();
          setTimeout(() => {
            this.gridTableService.setFocusCell(
              this.searchParams,
              data.colId,
              null,
              Number(data.rowIndex)
            );
          }, 100);
        }
      }
    };
    const focusCell = this.searchParams.api.getFocusedCell();
    const dataLocalStorage = localStorage.getItem(this.field);
    if (dataLocalStorage) {
      localStorage.removeItem(this.field);
    }
    if (focusCell) {
      const obj = {
        colId: focusCell.column.colId,
        rowIndex: focusCell.rowIndex
      };
      localStorage.setItem(this.field, JSON.stringify(obj));

    }
    setFocusedCell(this.searchParams, currentTab);
    const col = params.colDef.field;
    const data = params.data;
    switch (col) {
      case 'partsCode':
        if (!params.value || !params.value) {
          return;
        }
        this.searchParams.api.forEachNode(rowNode => {
          if (params.rowIndex === rowNode.rowIndex && params.value) {
            rowNode.setDataValue('partsCode', params.value.replace(/[^a-zA-Z0-9]/g, ''));
          }
        });
        break;
    }
    params.node.setData(data);
  }

  navigateToNextCell(params) {
    const KEY_UP = 38;
    const KEY_DOWN = 40;
    if ((params.key === KEY_UP || params.key === KEY_DOWN)) {
      return params.previousCellPosition;
    }
    return params.nextCellPosition;
  }
}
