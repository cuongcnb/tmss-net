import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {GridExportService} from '../../../shared/common-service/grid-export.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DlrVehicleInformationService} from '../../../api/swapping/dlr-vehicle-information.service';
import {GradeListService} from '../../../api/master-data/grade-list.service';
import {ColorListService} from '../../../api/master-data/color-list.service';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {FilterFormCode} from '../../../core/constains/filter-form-code';
import {DispatchChangeRequestService} from '../../../api/swapping/dispatch-change-request.service';
import {PaginationParamsModel} from '../../../core/models/base.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dispatch-change-request',
  templateUrl: './dispatch-change-request.component.html',
  styleUrls: ['./dispatch-change-request.component.scss']
})
export class DispatchChangeRequestComponent implements OnInit {
  @ViewChild('dispatchChangeApproveModal', {static: false}) dispatchChangeApproveModal;
  searchForm: FormGroup;
  dispatchChangeRequestData;
  fieldGrid;
  params;
  selectedDlrVehicle;

  paginationTotalsData: number;
  paginationParams: PaginationParamsModel;

  gradeList;
  allColors;
  fieldGradeList;
  fieldColorList;
  dealerList = [];
  filterFormCode = FilterFormCode;
  filterDataList = [];

  constructor(
    private formBuilder: FormBuilder,
    private gridExportService: GridExportService,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private gradeListService: GradeListService,
    private colorListService: ColorListService,
    private dealerListService: DealerListService,
    private dlrVehicleInformationService: DlrVehicleInformationService,
    private dispatchChangeRequestService: DispatchChangeRequestService
  ) {
    this.fieldGrid = [
      {
        field: 'dealer'
      },
      {
        field: 'grade'
      },
      {
        field: 'color'
      },
      {
        headerName: 'ETA',
        field: 'portEta'
      },
      {
        headerName: 'TMSS No',
        field: 'tmssNo'
      },
      {
        headerName: 'Latest Plan LOD Custom Plan',
        field: 'latestLoPlanDate',
        cellClass: ['cell-border']
      },
      {
        headerName: 'Allocation Month',
        field: 'assAlloMonth',
        cellClass: ['cell-border']
      },
      {
        headerName: 'Latest Dispatch Plan',
        field: 'dlrDispatchPlan',
        cellClass: ['cell-border']
      },
      {
        headerName: 'Dispatch Change Request',
        field: 'dispatchChangeReqDate',
        cellClass: ['cell-clickable', 'cell-border']
      },
      {
        headerName: 'Advance Request',
        field: 'advanceRequestDate',
        cellClass: ['cell-clickable', 'cell-border']
      },
      {
        headerName: 'New Dispatch Plan',
        field: 'newDispatchPlanDate',
        cellClass: ['cell-border']
      },
      {
        headerName: 'Original Dispatch Plan',
        field: 'originalDispatchPlanDate',
        cellClass: ['cell-border']
      },
      {
        headerName: 'Status',
        field: 'dispatchChangeStatus'
      },
      {
        headerName: 'Request Date',
        field: 'dispatchChangeSendDate',
        cellClass: ['cell-border']
      },
      {
        headerName: 'Confirm Date',
        field: 'dispatchChangeConfirmDate',
        cellClass: ['cell-border']
      },
      {
        headerName: 'LO / Des Act Arrival Date',
        field: 'loDateDesActArrivalDate',
        cellClass: ['cell-border']
      }
    ];
    this.fieldGradeList = [
      {
        headerName: 'marketing code',
        field: 'marketingCode'
      }
    ];
    this.fieldColorList = [
      {
        headerName: 'marketing code',
        field: 'code'
      }
    ];
  }

  ngOnInit() {
    this.gradeListService.getGrades(true).subscribe(gradeList => {
      this.gradeList = gradeList;
      this.loadingService.setDisplay(false);
    });
    this.colorListService.getColors().subscribe(allColors => {
      this.allColors = allColors;
      this.loadingService.setDisplay(false);
    });
    this.dealerListService.getDealers().subscribe(dealerList => {
      this.dealerList = dealerList;
      this.loadingService.setDisplay(false);
    });
    this.buildForm();
  }

  callbackGrid(params) {
    this.params = params;
    this.selectedDlrVehicle = undefined;
    this.loadingService.setDisplay(true);
    this.search();
  }

  getParams() {
    const selectedDlrVehicle = this.params.api.getSelectedRows();
    if (selectedDlrVehicle) {
      this.selectedDlrVehicle = selectedDlrVehicle[0];
    }
  }

  cellDoubleClicked(params) {
    const field = params.colDef.field;
    if ((field === 'dispatchChangeReqDate' || field === 'advanceRequestDate') && params.data.dispatchChangeStatus.toLowerCase() !== 'pending') {
      this.swalAlertService.openFailModal('Chỉ xe có trạng thái là "Pending" thì mới được duyệt');
      return;
    }
    if (field === 'dispatchChangeReqDate') {
      this.dispatchChangeApproveModal.open(params.data);
    } else if (field === 'advanceRequestDate') {
      this.dispatchChangeApproveModal.open(params.data, 'advance');
    }
  }

  searchWithSaleFilter(filterDataList) {
    this.filterDataList = filterDataList;
    this.resetPaginationParams();
    this.search();
  }

  changePaginationParams(paginationParams) {
    if (!this.dispatchChangeRequestData) {
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

  search() {
    this.loadingService.setDisplay(true);
    this.dispatchChangeRequestService.searchChangeDispatch(this.searchForm.value, this.filterDataList, this.paginationParams).subscribe(data => {
      if (data) {
        this.paginationTotalsData = data.total;
        this.dispatchChangeRequestData = data.list ? data.list : [];
        this.params.api.setRowData(this.dispatchChangeRequestData);
        this.loadingService.setDisplay(false);
      } else {
        this.paginationTotalsData = 0;
        this.dispatchChangeRequestData = [];
      }

      setTimeout(() => {
        if (this.params) {
          this.params.api.setRowData(this.dispatchChangeRequestData);
          this.setFilterModel(this.params);
        }
        this.loadingService.setDisplay(false);
      });
    });
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

  refresh() {
    this.callbackGrid(this.params);
  }

  export() {
    this.gridExportService.export(this.params, 'Dispatch Change Request');
  }

  private buildForm() {
    this.searchForm = this.formBuilder.group({
      quickSearch: [undefined],
      dealerId: [undefined],
      type: [undefined],
      gradeId: [undefined],
      colorId: [undefined],

      gradeControl: [undefined],
      colorControl: [undefined]
    });
    this.searchForm.get('gradeControl').valueChanges.subscribe(value => {
      if (value) {
        this.loadingService.setDisplay(true);
        this.gradeListService.getGradeColor(value.id).subscribe(colorsOfGrade => {
          this.loadingService.setDisplay(false);
          this.allColors = colorsOfGrade;
        });
        this.searchForm.patchValue({
          colorId: undefined,
          gradeId: value.id,
          colorControl: undefined
        });
      } else {
        this.searchForm.patchValue({
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

    this.searchForm.get('colorControl').valueChanges.subscribe(value => {
      this.searchForm.patchValue({
        colorId: value ? value.id : undefined
      });
    });
  }

}
