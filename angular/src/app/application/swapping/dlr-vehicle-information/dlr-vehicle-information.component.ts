import {Component, OnInit, ViewChild} from '@angular/core';
import {GridExportService} from '../../../shared/common-service/grid-export.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {GradeListService} from '../../../api/master-data/grade-list.service';
import {ColorListService} from '../../../api/master-data/color-list.service';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {DlrVehicleInformationService} from '../../../api/swapping/dlr-vehicle-information.service';
import {DlrVehicleSellCheckboxComponent} from './dlr-vehicle-sell-checkbox/dlr-vehicle-sell-checkbox.component';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import {FilterFormCode} from '../../../core/constains/filter-form-code';
import {EventBusType} from '../../../core/constains/eventBusType';
import {PaginationParamsModel} from '../../../core/models/base.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dlr-vehicle-information',
  templateUrl: './dlr-vehicle-information.component.html',
  styleUrls: ['./dlr-vehicle-information.component.scss']
})
export class DlrVehicleInformationComponent implements OnInit {
  @ViewChild('dlrAdvanceChangeRequestModal', {static: false}) dlrAdvanceChangeRequestModal;
  form: FormGroup;
  isTmv: boolean;
  exportParams;

  paginationTotalsData: number;
  paginationParams: PaginationParamsModel;

  dlrVehicleData = [];
  dlrVehicleInfoFieldGrid;
  dlrVehicleInfoFieldGridExport;
  dlrVehicleInfoParams;
  dlrVehicleInfoParamsExport;
  selectedDlrVehicle;

  gradeList;
  allColors;
  fieldGradeList;
  fieldColorList;
  currentUser;
  filterFormCode = FilterFormCode;
  filterDataList = [];

  agColEditable = {
    swapDealer: {
      fieldName: 'swapDealer',
      headerName: 'Swap Dealer'
    },
    dispatchChangeReqDate: {
      fieldName: 'dispatchChangeReqDate',
      headerName: 'Change Request'
    },
    advanceRequestDate: {
      fieldName: 'advanceRequestDate',
      headerName: 'Advance Request'
    }
  };

  constructor(
    private gridExportService: GridExportService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private gradeListService: GradeListService,
    private colorListService: ColorListService,
    private dealerListService: DealerListService,
    private dlrVehicleInformationService: DlrVehicleInformationService,
    private formStoringService: FormStoringService,
    private eventBusService: EventBusService,
    private formBuilder: FormBuilder
  ) {
    this.dlrVehicleInfoFieldGrid = [
      {
        field: 'isSell',
        cellRendererFramework: DlrVehicleSellCheckboxComponent,
        minWidth: 80
      },
      {
        headerName: this.agColEditable.swapDealer.headerName,
        field: this.agColEditable.swapDealer.fieldName,
        cellClass: ['cell-clickable', 'cell-border', 'text-right'],
        minWidth: 80
      },
      {
        field: 'grade',
        minWidth: 80
      },
      {
        field: 'color',
        minWidth: 80
      },
      {
        headerName: 'TMSS No',
        field: 'tmssNo',
        minWidth: 80
      },
      {
        headerName: 'LO/ CBU docs plan',
        field: 'latestLoPlanDate',
        minWidth: 80,
        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'Allo Month',
        field: 'assAlloMonth',
        minWidth: 80,
        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'Latest Dispatch Plan',
        field: 'dlrDispatchPlan',
        cellClass: ['cell-border', 'text-right'],
        minWidth: 80
      },
      {
        headerName: this.agColEditable.dispatchChangeReqDate.headerName,
        field: this.agColEditable.dispatchChangeReqDate.fieldName,
        cellClass: () => {
          return !this.isTmv ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right'];
        }
      },
      {
        headerName: this.agColEditable.advanceRequestDate.headerName,
        field: this.agColEditable.advanceRequestDate.fieldName,
        cellClass: () => {
          return !this.isTmv ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right'];
        }
      },
      {
        headerName: 'Original Dispatch Plan',
        field: 'originalDispatchPlanDate',
        cellClass: ['cell-border', 'text-right'],
        minWidth: 100
      },
      {
        headerName: 'New Dispatch Plan',
        field: 'newDispatchPlanDate',
        cellClass: ['cell-border', 'text-right'],
        minWidth: 100
      },
      {
        headerName: 'Request Date',
        // field: 'dispatchChangeSendDate',
        field: 'swapRequestDate',
        cellClass: ['cell-border', 'text-right'],
        minWidth: 100
      },
      {
        headerName: 'Confirm Date',
        field: 'dispatchChangeConfirmDate',
        cellClass: ['cell-border', 'text-right'],
        minWidth: 100
      },
      {
        field: 'status',
        minWidth: 80
      }
    ];
    this.dlrVehicleInfoFieldGridExport = [
      {
        headerName: this.agColEditable.swapDealer.headerName,
        field: this.agColEditable.swapDealer.fieldName,
        cellClass: ['cell-clickable', 'cellBorder', 'text-right'],
        minWidth: 80
      },
      {
        field: 'grade',
        cellClass: ['cellBorder'],
        minWidth: 80
      },
      {
        field: 'color',
        cellClass: ['cellBorder', 'stringType'],
        minWidth: 80
      },
      {
        headerName: 'TMSS No',
        field: 'tmssNo',
        cellClass: ['cellBorder'],
        minWidth: 80
      },
      {
        headerName: 'LO/ CBU docs plan',
        field: 'latestLoPlanDate',
        cellClass: ['cellBorder', 'text-right'],
        minWidth: 80
      },
      {
        headerName: 'Allo Month',
        field: 'assAlloMonth',
        cellClass: ['cellBorder', 'text-right'],
        minWidth: 80
      },
      {
        headerName: 'Latest Dispatch Plan',
        field: 'dlrDispatchPlan',
        cellClass: ['cellBorder', 'text-right'],
        minWidth: 80
      },
      {
        headerName: this.agColEditable.dispatchChangeReqDate.headerName,
        field: this.agColEditable.dispatchChangeReqDate.fieldName,
        cellClass: () => {
          return !this.isTmv ? ['cell-clickable', 'cellBorder', 'text-right'] : ['cellBorder', 'text-right'];
        }
      },
      {
        headerName: this.agColEditable.advanceRequestDate.headerName,
        field: this.agColEditable.advanceRequestDate.fieldName,
        cellClass: () => {
          return !this.isTmv ? ['cell-clickable', 'cellBorder', 'text-right'] : ['cellBorder', 'text-right'];
        }
      },
      {
        headerName: 'Original Dispatch Plan',
        field: 'originalDispatchPlanDate',
        cellClass: ['cellBorder', 'text-right'],
        minWidth: 100
      },
      {
        headerName: 'New Dispatch Plan',
        field: 'newDispatchPlanDate',
        cellClass: ['cellBorder', 'text-right'],
        minWidth: 100
      },
      {
        headerName: 'Request Date',
        // field: 'dispatchChangeSendDate',
        field: 'swapRequestDate',
        cellClass: ['cellBorder', 'text-right'],
        minWidth: 100
      },
      {
        headerName: 'Confirm Date',
        field: 'dispatchChangeConfirmDate',
        cellClass: ['cellBorder', 'text-right'],
        minWidth: 100
      },
      {
        field: 'status',
        cellClass: ['cellBorder'],
        minWidth: 80
      }
    ];
    this.fieldGradeList = [
      {
        headerName: 'marketing code',
        field: 'marketingCode',
        minWidth: 100
      }
    ];
    this.fieldColorList = [
      {
        headerName: 'marketing code',
        field: 'code',
        minWidth: 100
      }
    ];
  }

  ngOnInit() {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.isTmv = this.currentUser.isAdmin;
    this.buildForm();
    this.getGradeList();
    this.getColorList();
    this.search();
    this.eventBusService.on(EventBusType.dlrVehicleSellCheckbox).subscribe(() => this.search());
  }

  getGradeList() {
    const gradeApi = this.currentUser.isAdmin ? this.gradeListService.getGrades(true) : this.currentUser.isLexus
      ? this.gradeListService.getGrades(true, 'lexusOnly')
      : this.gradeListService.getGrades(true, 'notLexus');
    this.loadingService.setDisplay(true);
    gradeApi.subscribe(grades => {
      this.gradeList = grades;
      this.loadingService.setDisplay(false);
    });
  }

  getColorList() {
    this.loadingService.setDisplay(true);
    this.colorListService.getColorsAvailable().subscribe(allColors => {
      this.allColors = allColors;
      this.loadingService.setDisplay(false);
    });
  }

  callbackGrid(params) {
    this.dlrVehicleInfoParams = params;
    this.dlrVehicleInfoParamsExport = params;
  }

  getParams() {
    const selectedDlrVehicle = this.dlrVehicleInfoParams.api.getSelectedRows();
    if (selectedDlrVehicle) {
      this.selectedDlrVehicle = selectedDlrVehicle[0];
    }
  }

  cellDoubleClicked(params) {
    const colName = params.colDef.field;

    if (this.isTmv) {
      if (colName === this.agColEditable.swapDealer.fieldName) {
        if (params.data.isSell) {
          this.swalAlertService.openFailModal('Xe đã được Bán, không thể Swap được xe này');
          return;
        }
        this.dlrAdvanceChangeRequestModal.open(this.selectedDlrVehicle, this.agColEditable.swapDealer);
      }
      return;
    }

    for (const key in this.agColEditable) {
      if (colName === this.agColEditable[key].fieldName) {
        if (params.data.swapDealer) {
          if (colName === 'isSell') {
            this.swalAlertService.openFailModal('Xe đã được Swap, không thể bán được xe này');
            return;
          }
          if (colName === this.agColEditable.dispatchChangeReqDate.fieldName || colName === this.agColEditable.advanceRequestDate.fieldName) {
            this.swalAlertService.openFailModal('Không thể thay đổi được xe đã Swap');
            return;
          }
        }

        if (params.data.isSell) {
          if (colName === this.agColEditable.swapDealer.fieldName) {
            this.swalAlertService.openFailModal('Xe đã được Bán, không thể Swap được xe này');
            return;
          }
          if (colName === this.agColEditable.dispatchChangeReqDate.fieldName || colName === this.agColEditable.advanceRequestDate.fieldName) {
            this.swalAlertService.openFailModal('Không thể thay đổi được xe đã Sell');
            return;
          }
        }

        this.dlrAdvanceChangeRequestModal.open(this.selectedDlrVehicle, this.agColEditable[key]);
      }
    }
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  searchWithSaleFilter(filterDataList) {
    this.filterDataList = filterDataList;
    this.resetPaginationParams();
    this.search();
  }

  changePaginationParams(paginationParams) {
    if (!this.dlrVehicleData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  setFilterModel(params) {
    if (this.paginationParams && this.paginationParams.filters.length) {
      const obj = {};
      this.paginationParams.filters.map(item => {
        obj[item.fieldFilter] = {
          type: 'contains',
          filterType: 'text',
          filter: item.filterValue
        };
      });

      params.api.setFilterModel(obj);
    }
  }

  search() {
    this.loadingService.setDisplay(true);
    this.dlrVehicleInformationService.searchDlrVehicleInfo(this.form.value, this.filterDataList, this.paginationParams).subscribe(dlrVehicleData => {
      if (dlrVehicleData) {
        this.paginationTotalsData = dlrVehicleData.total;
        this.dlrVehicleData = dlrVehicleData.vehicleStockList;

        if (this.selectedDlrVehicle) {
          this.dlrVehicleInfoParams.api.forEachNode(node => {
            if (node.data.id === this.selectedDlrVehicle.id) {
              node.setSelected(true);
              this.dlrVehicleInfoParams.api.setFocusedCell(node.rowIndex, 'swapDealer');
            }
          });
        }
      } else {
        this.paginationTotalsData = 0;
        this.dlrVehicleData = [];
      }

      setTimeout(() => {
        if (this.dlrVehicleInfoParams) {
          this.dlrVehicleInfoParams.api.setRowData(this.dlrVehicleData);
          this.dlrVehicleInfoParamsExport.api.setRowData(this.dlrVehicleData);
          this.setFilterModel(this.dlrVehicleInfoParams);
        }
        this.loadingService.setDisplay(false);
      }, 500);
    });
  }

  getExportParams(params) {
    this.exportParams = params;
  }

  export() {
    this.loadingService.setDisplay(true);
    this.dlrVehicleInformationService.searchDlrVehicleInfo(this.form.value, this.filterDataList, {filters: []}).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.exportParams.api.setRowData(res && res.vehicleStockList ? res.vehicleStockList : []);
      this.gridExportService.export(this.exportParams, 'DLR Vehicle Information');
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      quickSearch: [undefined],
      dealerId: [this.currentUser.dealerId],
      type: [undefined],
      gradeId: [undefined],
      colorId: [undefined],

      gradeControl: [undefined],
      colorControl: [undefined]
    });

    this.form.get('gradeControl').valueChanges.subscribe(value => {
      if (value) {
        this.loadingService.setDisplay(true);
        this.gradeListService.getGradeColor(value.id).subscribe(colorsOfGrade => {
          this.loadingService.setDisplay(false);
          this.allColors = colorsOfGrade;
        });
        this.form.patchValue({
          colorId: undefined,
          gradeId: value.id,
          colorControl: undefined
        });
      } else {
        this.form.patchValue({
          colorId: undefined,
          gradeId: undefined,
          colorControl: undefined
        });
        this.loadingService.setDisplay(true);
        this.colorListService.getColorsAvailable().subscribe(colors => {
          this.loadingService.setDisplay(false);
          this.allColors = colors;
        });
      }
    });

    this.form.get('colorControl').valueChanges.subscribe(value => {
      this.form.patchValue({
        colorId: value ? value.id : undefined
      });
    });
  }

}
