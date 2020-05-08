import { EventBus } from './../../../core/constains/eventBus';
import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { remove } from 'lodash';

import {
  PartHistoryInfo,
  PartsInfoManagementModel
} from '../../../core/models/parts-management/parts-info-management.model';
import {PartsInfoManagementApi} from '../../../api/parts-management/parts-info-management.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {SuppliersCommonApi} from '../../../api/common-api/suppliers-common.api';
import {SupplierCatalogModel} from '../../../core/models/catalog-declaration/supplier-catalog.model';
import {PartTypesApi} from '../../../api/parts-management/part-types.api';
import {UnitCommonApi} from '../../../api/common-api/unit-common.api';
import {UnitCommonModel} from '../../../core/models/common-models/unit-common.model';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {PartTypeCommonModel} from '../../../core/models/common-models/part-type-common.model';
import {CurrentUserModel, PaginationParamsModel} from '../../../core/models/base.model';
import {CurrencyApi} from '../../../api/common-api/currency.api';
import {CurrencyModel} from '../../../core/models/common-models/currency.model';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {DealerModel} from '../../../core/models/sales/dealer.model';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {AgCheckboxRendererComponent} from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import {AgCheckboxHeaderRendererComponent} from '../../../shared/ag-checkbox-header-renderer/ag-checkbox-header-renderer.component';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-info-management',
  templateUrl: './parts-info-management.component.html',
  styleUrls: ['./parts-info-management.component.scss']
})
export class PartsInfoManagementComponent extends AppComponentBase implements OnInit {
  @ViewChild('importPartsInfoModal', {static: false}) importPartsInfoModal;
  @ViewChild('editPartInfoModal', {static: false}) editPartInfoModal;
  // currentUser: CurrentUserModel = CurrentUser;
  searchForm: FormGroup;
  dealerList: Array<DealerModel>;
  kpiPartTypes: string[];

  fieldGridPartList;
  partListParams;
  partsInfoData: Array<PartsInfoManagementModel>;
  selectedPart: PartsInfoManagementModel;
  partListForExport: Array<PartsInfoManagementModel> = [];
  frameworkComponents;

  tabList: Array<string>;
  selectedTab;

  partDetailForm: FormGroup;
  showSaveButton;

  fieldGridPriceHistory;
  priceHistoryParams;
  priceHistoryData: Array<PartHistoryInfo>;
  paginationParams: PaginationParamsModel;
  paginationTotalsData: number;

  supplierList: Array<SupplierCatalogModel>;
  partTypes: Array<PartTypeCommonModel>;
  unitArr: Array<UnitCommonModel>;
  currencyArr: Array<CurrencyModel>;

  fieldGridExport;
  exportParams;
  excelStyles;

  constructor(
    injector: Injector,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private supplierApi: SuppliersCommonApi,
    private partTypesApi: PartTypesApi,
    private unitCommonApi: UnitCommonApi,
    private currencyApi: CurrencyApi,
    private gridTableService: GridTableService,
    private dealerApi: DealerApi
  ) {
    super(injector);
  }

  ngOnInit() {
    this.fieldGridPartList = [
      {
        headerName: '',
        headerTooltip: '',
        field: 'checkForExport',
        width: 15,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      },
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 30,
        cellClass: ['cell-border']
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        width: 80,
        cellClass: ['cell-border']
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        },
        cellClass: ['cell-border']
      },
      {
        headerName: 'Được tạo bởi',
        headerTooltip: 'Được tạo bởi',
        field: 'dlrName',
        width: 100,
        cellClass: ['cell-border']
      }
    ];
    this.fieldGridPriceHistory = [
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'STT',
            headerTooltip: 'Số thứ tự',
            field: 'stt',
            width: 50
          }
        ]
      },
      {
        headerName: 'Nhập',
        headerTooltip: 'Nhập',
        children: [
          {
            headerName: 'Giá nhập',
            headerTooltip: 'Giá nhập',
            field: 'price',
            cellClass: ['cell-readonly', 'cell-border', 'text-right'],
            width: 150,
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
          },
          {
            headerName: 'ĐVT',
            headerTooltip: 'Đơn vị tính',
            field: 'unit',
            width: 70,
            cellClass: ['cell-readonly', 'cell-border']
          }
        ]
      },
      {
        headerName: 'Bán',
        headerTooltip: 'Bán',
        children: [
          {
            headerName: 'Giá bán',
            headerTooltip: 'Giá bán',
            field: 'sellPrice',
            cellClass: ['cell-readonly', 'cell-border', 'text-right'],
            width: 150,
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
          },
          {
            headerName: 'ĐVT',
            headerTooltip: 'Đơn vị tính',
            field: 'sellUnit',
            width: 70
          }
        ]
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'Áp dụng',
            headerTooltip: 'Áp dụng',
            field: 'effectiveFrom',
            cellClass: ['cell-readonly', 'cell-border', 'text-right'],
            width: 150,
            tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
            valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
          },
          {
            headerName: 'Hết hạn',
            headerTooltip: 'Hết hạn',
            field: 'effectiveTo',
            cellClass: ['cell-readonly', 'cell-border', 'text-right'],
            width: 150,
            tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
            valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
          }
        ]
      }
    ];
    this.fieldGridExport = [
      {
        headerName: 'DLR_CODE',
        headerTooltip: 'DLR_CODE',
        field: 'dlrCode',
        cellClass: ['dlrCode', 'cell-border', 'font-size'],
        width: 75
      },
      {
        headerName: 'GENUINE',
        headerTooltip: 'GENUINE',
        field: 'genuine',
        cellClass: ['genuine', 'cell-border', 'font-size'],
        width: 75
      },
      {
        headerName: 'LOCALFLAG',
        headerTooltip: 'LOCALFLAG',
        field: 'localFlag',
        cellClass: ['localFlag', 'cell-border', 'font-size'],
        width: 80
      },
      {
        headerName: 'PARTSTYPE_CODE',
        headerTooltip: 'PARTSTYPE_CODE',
        field: 'partsTypeCode',
        cellClass: ['partsTypeCode', 'cell-border', 'font-size'],
        width: 100
      },
      {
        headerName: 'PARTSCODE',
        headerTooltip: 'PARTSCODE',
        field: 'partsCode',
        cellClass: ['partsCode', 'cell-border', 'font-size'],
        width: 120
      },
      {
        headerName: 'PARTSNAME',
        headerTooltip: 'PARTSNAME',
        field: 'partsName',
        cellClass: ['partsName', 'cell-border', 'font-size'],
        width: 150
      },
      {
        headerName: 'PARTSNAMEVN',
        headerTooltip: 'PARTSNAMEVN',
        field: 'partsNameVn',
        cellClass: ['partsNameVn', 'cell-border', 'font-size'],
        width: 150
      },
      {
        headerName: 'PNC',
        headerTooltip: 'PNC',
        field: 'pnc',
        cellClass: ['pnc', 'cell-border', 'font-size'],
        width: 50
      },
      {
        headerName: 'PRICE',
        headerTooltip: 'PRICE',
        field: 'price',
        cellClass: ['price', 'cell-border', 'font-size'],
        width: 80
      },
      {
        headerName: 'UNIT_CODE',
        headerTooltip: 'UNIT_CODE',
        field: 'unitCode',
        cellClass: ['unitCode', 'cell-border', 'font-size'],
        width: 80
      },
      {
        headerName: 'SELLPRICE',
        headerTooltip: 'SELLPRICE',
        field: 'sellPrice',
        cellClass: ['sellPrice', 'cell-border', 'font-size'],
        width: 80

      },
      {
        headerName: 'SELLUNIT_CODE',
        headerTooltip: 'SELLUNIT_CODE',
        field: 'sellUnitCode',
        cellClass: ['sellUnitCode', 'cell-border', 'font-size'],
        width: 100

      },
      {
        headerName: 'RATE',
        headerTooltip: 'RATE',
        field: 'rate',
        cellClass: ['rate', 'cell-border', 'font-size'],
        width: 50

      },
      {
        headerName: 'FOBPRICE',
        headerTooltip: 'FOBPRICE',
        field: 'fobPrice',
        cellClass: ['fobPrice', 'cell-border', 'font-size'],
        width: 60

      },
      {
        headerName: 'FOBCURRENCYCODE',
        headerTooltip: 'FOBCURRENCYCODE',
        field: 'fobUnit',
        cellClass: ['fobUnit', 'cell-border', 'font-size'],
        width: 120
      },
      {
        headerName: 'SUPPLIER_CODE',
        headerTooltip: 'SUPPLIER_CODE',
        field: 'supplierCode',
        cellClass: ['supplierCode', 'cell-border', 'font-size'],
        width: 100
      },
      {
        headerName: 'SUBSTITUTIONCODE',
        headerTooltip: 'SUBSTITUTIONCODE',
        field: 'substitutioncode',
        cellClass: ['substitutioncode', 'cell-border', 'font-size'],
        width: 130
      },
      {
        headerName: 'SUBSTITUTIONPARTNO',
        headerTooltip: 'SUBSTITUTIONPARTNO',
        field: 'substitutionpartno',
        cellClass: ['substitutionpartno', 'cell-border', 'font-size'],
        width: 130
      },
      {
        headerName: 'SUBSTITUTIONPARTNO_OLD',
        headerTooltip: 'SUBSTITUTIONPARTNO_OLD',
        field: 'substitutionpartnoOld',
        cellClass: ['substitutionpartnoOld', 'cell-border', 'font-size'],
        width: 160

      },
      {
        headerName: 'HANDLEMODEL',
        headerTooltip: 'HANDLEMODEL',
        field: 'handlemodel',
        cellClass: ['handlemodel', 'cell-border', 'font-size'],
        width: 100
      },
      {
        headerName: 'REMARK',
        headerTooltip: 'REMARK',
        field: 'remark',
        cellClass: ['remark', 'cell-border', 'font-size'],
        width: 50
      },
      {
        headerName: 'PART_SIZE',
        headerTooltip: 'PART_SIZE',
        field: 'partSize',
        cellClass: ['partSize', 'cell-border', 'font-size'],
        width: 50
      },
      {
        headerName: 'EXPRESS_SHIPPING',
        headerTooltip: 'EXPRESS_SHIPPING',
        field: 'expressShipping',
        cellClass: ['expressShipping', 'cell-border', 'font-size'],
        width: 120
      },
      {
        headerName: 'FR_CD',
        headerTooltip: 'FR_CD',
        field: 'frCd',
        cellClass: ['frCd', 'cell-border', 'font-size'],
        width: 50
      }
    ];

    this.excelStyles = [
      {
        id: 'header',
        interior: {
          color: '#CCCCCC',
          pattern: 'Solid'
        },
        font: {
          size: 12,
          fontName: 'Times New Roman'
        },
        borders: {
          borderBottom: {
            color: '#0a101d',
            lineStyle: 'Continuous',
            weight: 1
          },
          borderLeft: {
            color: '#0a101d',
            lineStyle: 'Continuous',
            weight: 1
          },
          borderRight: {
            color: '#0a101d',
            lineStyle: 'Continuous',
            weight: 1
          },
          borderTop: {
            color: '#0a101d',
            lineStyle: 'Continuous',
            weight: 1
          }
        }
      },
      {
        id: 'font-size',
        font: {
          size: 11,
          fontName: 'Times New Roman'
        }

      },
      {
        id: 'dlrCode',
        dataType: 'string'

      },
      {
        id: 'genuine'
      },
      {
        id: 'localFlag'
      },
      {
        id: 'partsTypeCode'
      },
      {
        id: 'partsCode',
        dataType: 'string'

      },
      {
        id: 'partsName'
      },
      {
        id: 'partsNameVn'
      },
      {
        id: 'pnc'
      },
      {
        id: 'price',
        dataType: 'number'

      },
      {
        id: 'unitCode'
      },
      {
        id: 'sellPrice',
        dataType: 'number'
      },
      {
        id: 'sellUnitCode'
      },
      {
        id: 'rate'
      },
      {
        id: 'fobPrice',
        dataType: 'number'
      },
      {
        id: 'fobUnit'
      },
      {
        id: 'supplierCode'
      },
      {
        id: 'substitutioncode'
      },
      {
        id: 'substitutionpartno',
        dataType: 'number'

      },
      {
        id: 'substitutionpartnoOld'
      },
      {
        id: 'handlemodel'
      },
      {
        id: 'remark'
      },
      {
        id: 'partSize'
      },
      {
        id: 'expressShipping'
      },
      {
        id: 'frCd'
      }
    ];
    this.buildPartDetailForm();
    this.buildSearchForm();
    this.initTabs();
    this.selectedTab = this.tabList[0];
    this.masterApi();
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent
    };
    this.kpiPartTypes = ['ACC', 'BODY PARTS', 'CHEMICALS', 'GP', 'KEY PRODUCTS', 'OIL'];
  }

  masterApi() {
    this.loadingService.setDisplay(true);
    forkJoin([
      this.supplierApi.getSupplierByCreator(),
      this.partTypesApi.getAll(false),
      this.unitCommonApi.getActiveUnit(),
      this.currencyApi.getAll(),
      this.dealerApi.getAllAvailableDealers()
    ]).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.supplierList = res[0];
      this.partTypes = res[1];
      this.unitArr = res[2];
      this.currencyArr = res[3];
      this.dealerList = res[4];
    });
  }

  changePaginationParams(paginationParams) {
    if (!this.partsInfoData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.searchPartsInfo();
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  searchPartsInfo() {
    this.loadingService.setDisplay(true);
    this.partsInfoManagementApi.searchPartsInfo(this.searchForm.value, this.paginationParams).subscribe(data => {
      this.loadingService.setDisplay(false);
      this.partsInfoData = data.list;
      this.paginationTotalsData = data.total;
      this.partListParams.api.setRowData(this.gridTableService.addSttToData(this.partsInfoData, this.paginationParams));
      this.partListForExport = [];
      if (this.partsInfoData.length) {
        this.partListParams.api.setFocusedCell(0, 'stt');
      } else {
        this.buildPartDetailForm();
        this.priceHistoryParams.api.setRowData([]);
      }
    });
  }

  refreshAfterEdit(updatedValue) {
    this.searchForm.patchValue({
      partsCode: updatedValue.partsCode,
      partsName: null,
      supplierId: null,
      genuine: null,
      pnc: null
    });
    this.resetPaginationParams();
    this.searchPartsInfo();
  }

  // =====***** PART LIST GRID *****=====
  callBackGridPartList(params) {
    this.partListParams = params;
  }

  getParamsPartList() {
    this.partListForExport = [];
    const selectedParts = this.partListParams.api.getSelectedRows();
    if (selectedParts) {
      selectedParts.forEach(it => this.partListForExport.push(it));
    }
    this.getCellData();
  }

  onCellFocused(event) {
    this.getCellData();
  }

  agKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.getCellData();
  }

  getCellData() {
    if (this.partListParams) {
      const focusCell = this.partListParams.api.getFocusedCell();
      this.selectedPart = this.partListParams.api.getRowNode(focusCell.rowIndex).data;
      this.partDetailForm.patchValue(this.selectedPart ? this.selectedPart : {});
      this.getPartsHistoryData();
    }
  }

  getPartsHistoryData() {
    if (this.selectedPart) {
      this.loadingService.setDisplay(true);
      this.partsInfoManagementApi.getPartsHistory(this.selectedPart.id).subscribe(priceHistoryData => {
        this.priceHistoryData = priceHistoryData;
        this.priceHistoryParams.api.setRowData(this.gridTableService.addSttToData(this.priceHistoryData));
        this.loadingService.setDisplay(false);
      });
    }
  }

  get checkEditablePart() {
    let editable = true;
    if (!this.selectedPart) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn phụ tùng, hãy chọn một phụ tùng');
      editable = false;
      return;
    }
    if (this.selectedPart.dlrId !== this.currentUser.dealerId) {
      this.swalAlertService.openWarningToast('Không được sửa/xóa phụ tùng của đại lý khác');
      editable = false;
      return;
    }
    return editable;
  }

  modifySelectedPart() {
    if (this.checkEditablePart) {
      this.editPartInfoModal.open(this.selectedPart);
    }
  }

  cellValueChanged(params) {
    // const field = params.colDef.field;
    // if (field === 'checkForExport') {
    //   if (params.data[field]) {
    //     this.partListForExport.push(params.data);
    //   } else if (this.partListForExport.length) {
    //     remove(this.partListForExport, params.data);
    //   }
    // }
  }

  exportCsv() {
    if (this.partListForExport.length === 0) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn phụ tùng, hãy chọn ít nhất một phụ tùng để xuất dữ liệu', 'Cảnh báo');
      return;
    }
    const fileName = this.gridTableService.generateExportFileName('QuanLyThongTinPT', StorageKeys.partsInfoManagementExportTimes);
    this.exportParams.api.setRowData(this.partListForExport);
    this.exportParams.api.exportDataAsCsv({fileName, sheetName: fileName});
  }

  // =====***** PRICE HISTORY GRID TABLE *****=====
  callBackGridPriceHistory(params) {
    this.priceHistoryParams = params;
  }

  getParamsPriceHistory() {
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }

  private initTabs() {
    this.tabList = ['Thông tin phụ tùng', 'Lịch sử giá phụ tùng'];
  }

  private buildSearchForm() {
    this.searchForm = this.formBuilder.group({
      dlrId: [undefined],
      partsCode: [undefined],
      partsName: [undefined],
      supplierId: [undefined],
      genuine: [undefined],
      pnc: [undefined],
      status: ['Y']
    });
  }

  private buildPartDetailForm() {
    this.partDetailForm = this.formBuilder.group({
      id: [undefined],
      partsType: [undefined],
      localFlag: [undefined],
      partsCode: [undefined],
      pnc: [undefined],
      partsName: [undefined],
      partsNameVn: [undefined],
      price: [undefined],
      unit: [undefined],
      sellPrice: [undefined],
      sellUnit: [undefined],
      rate: [undefined],
      fobPrice: [undefined],
      fobUnit: [undefined],
      supplier: [undefined],
      leadTime: [undefined],
      kpiPartType: [undefined],
      newPart: [undefined],
      oldPart: [undefined],
      handlemodel: [undefined],
      frCd: [undefined],
      partSize: [undefined],
      expressShipping: [undefined],
      coo: [undefined],
      status: [undefined],
      remark: [undefined]
    });
    this.partDetailForm.disable();
  }

  public changeSearchInput(value: any, fieldName: string, filter: boolean = false) {
    if (filter) {
      value = this.removeSpecialChar(value);
    }
    this.searchForm.patchValue({
      [fieldName]: value
    });
  }

  public removeSpecialChar(value): any {
    value = value.replace(/[^a-zA-Z0-9]/g, '');
    return value;
  }
}
