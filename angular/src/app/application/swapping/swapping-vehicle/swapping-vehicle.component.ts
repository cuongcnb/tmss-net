import {Component, OnInit, ViewChild} from '@angular/core';
import {GridExportService} from '../../../shared/common-service/grid-export.service';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {GradeListService} from '../../../api/master-data/grade-list.service';
import {ColorListService} from '../../../api/master-data/color-list.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {SwappingVehicleService} from '../../../api/swapping/swapping-vehicle.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PaginationParamsModel} from '../../../core/models/base.model';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {ToastService} from '../../../shared/common-service/toast.service';

declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'swapping-vehicle',
  templateUrl: './swapping-vehicle.component.html',
  styleUrls: ['./swapping-vehicle.component.scss']
})
export class SwappingVehicleComponent implements OnInit {
  @ViewChild('confirmReject', {static: false}) confirmReject;
  searchForm: FormGroup;
  swappingVehicleData;
  swappingVehicleGridField;
  params;
  selectedSwappingVehicle;
  paginationTotalsData: number;
  paginationParams: PaginationParamsModel;
  currentUser;
  gradeList;
  allColors;
  dealerList;
  fieldGradeList;
  fieldColorList;

  constructor(
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private gridExportService: GridExportService,
    private formStoringService: FormStoringService,
    private gradeListService: GradeListService,
    private colorListService: ColorListService,
    private dealerListService: DealerListService,
    private swappingVehicleService: SwappingVehicleService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmService
  ) {
    this.swappingVehicleGridField = [
      {
        headerName: 'Swap Out',
        children: [
          {
            field: 'status',
            minWidth: 80
          },
          {
            headerName: 'Grade',
            field: 'gradeSo',
            minWidth: 80
          },
          {
            headerName: 'Color',
            field: 'colorSo',
            minWidth: 80
          },
          {
            headerName: 'TMSS No',
            field: 'tmssNoSo',
            minWidth: 80
          },
          {
            headerName: 'DLR Dispatch Plan',
            field: 'dlrDispatchPlanSo',
            cellClass: ['cell-border'],
            minWidth: 120
          },
          {
            headerName: 'Allo Month',
            field: 'alloMonthSo',
            cellClass: ['cell-border'],
            minWidth: 120
          },
          {
            headerName: 'LO Month',
            field: 'cbuProductionMonthSo',
            minWidth: 120
          },
          {
            field: 'dealer',
            minWidth: 80
          }

        ]
      },
      {
        headerName: 'Swap In',
        children: [
          {
            field: 'swapDealer',
            minWidth: 80
          },
          {
            headerName: 'Grade',
            field: 'gradeSi',
            minWidth: 80
          },
          {
            headerName: 'Color',
            field: 'colorSi',
            minWidth: 80
          },
          {
            headerName: 'ETA',
            field: 'portEta',
            minWidth: 80
          },
          {
            headerName: 'TMSS No',
            field: 'tmssNoSi',
            minWidth: 80
          },
          {
            headerName: 'DLR Dispatch Plan',
            field: 'dlrDispatchPlanSi',
            cellClass: ['cell-border', 'text-right'],
            minWidth: 120
          },
          {
            headerName: 'Allo Month',
            field: 'alloMonthSi',
            cellClass: ['cell-border', 'text-right'],
            minWidth: 120
          },
          {
            headerName: 'LO Month',
            field: 'cbuProductionMonthSi',
            minWidth: 120
          },
          {
            field: 'kindOfSwap',
            minWidth: 80
          }
        ]
      }
    ];
    this.fieldGradeList = [
      {
        headerName: 'marketing code',
        field: 'marketingCode',
        minWidth: 80
      }
    ];
    this.fieldColorList = [
      {
        headerName: 'marketing code',
        field: 'code',
        minWidth: 80
      }
    ];
  }

  ngOnInit() {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.buildForm();
    this.getGradeList();
    this.getColorList();
    this.getDealerList();
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
    this.colorListService.getColors().subscribe(allColors => {
      this.allColors = allColors;
      this.loadingService.setDisplay(false);
    });
  }

  getDealerList() {
    if (this.currentUser.dealerId === -1) {
      this.loadingService.setDisplay(true);
      this.dealerListService.getDealers().subscribe(dealerList => {
        this.dealerList = dealerList;
        this.loadingService.setDisplay(false);
      });
    }
  }

  callbackGrid(params) {
    this.params = params;
    this.search();
  }

  getParams() {
    const selectedSwappingVehicle = this.params.api.getSelectedRows();
    if (selectedSwappingVehicle) {
      this.selectedSwappingVehicle = selectedSwappingVehicle[0];
    }
  }

  refresh() {
    this.resetPaginationParams();
    this.search();
    this.selectedSwappingVehicle = undefined;
  }

  search() {
    this.loadingService.setDisplay(true);
    this.swappingVehicleService.headerSearch(this.searchForm.value, this.paginationParams).subscribe(swappingVehicleData => {
      if (swappingVehicleData) {
        this.swappingVehicleData = swappingVehicleData.list;
        this.paginationTotalsData = swappingVehicleData.total;
      } else {
        this.swappingVehicleData = [];
        this.paginationTotalsData = 0;
      }
      setTimeout(() => {
        if (this.params) {
          this.params.api.setRowData(this.swappingVehicleData);
          this.setFilterModel(this.params);
        }
        this.loadingService.setDisplay(false);
      }, 500);
    });
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  changePaginationParams(paginationParams) {
    if (!this.swappingVehicleData) {
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

  get disableApproveRejectBtn() {
    let val = true;
    if (this.selectedSwappingVehicle
      && (this.selectedSwappingVehicle.status === 'Wait Approve' && (this.selectedSwappingVehicle.gradeSo && this.selectedSwappingVehicle.gradeSi))) {
      val = null;
    } else {
      val = true;
    }
    return val;
  }

  approveReject(isApprove?: boolean) {
    const apiCall = isApprove
      ? this.swappingVehicleService.approveSwapVehicle(this.selectedSwappingVehicle)
      : this.swappingVehicleService.rejectSwapVehicle(this.selectedSwappingVehicle);
    const confirmMessage = isApprove ? 'Do you want to approve this swap?' : 'Do you want to reject this swap?';
    this.confirmationService.openConfirmModal('Are you sure?', confirmMessage)
      .subscribe(() => {

        this.loadingService.setDisplay(true);
        apiCall.subscribe(() => {
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
          this.search();
        }, err => {
          if (err.status === 522) {
            this.confirmationService
              .openConfirmModal(
                'Bản ghi đang được sử dụng',
                'Bạn phải reload lại dữ liệu trước khi update. Bạn có đồng ý reload lại dữ liệu không?'
              )
              .subscribe(() => {
                this.search();
              }, () => {
              });
          }
        });
      });
  }

  export() {
    this.gridExportService.export(this.params, 'Swapping Vehicle');
  }

  private buildForm() {
    this.searchForm = this.formBuilder.group({
      quickSearch: [undefined],
      dealerId: [!this.currentUser.isAdmin ? this.currentUser.dealerId : undefined],
      gradeControl: [undefined],
      colorControl: [undefined],
      status: ['wait_approve'],
      gradeId: [undefined],
      colorId: [undefined]
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
