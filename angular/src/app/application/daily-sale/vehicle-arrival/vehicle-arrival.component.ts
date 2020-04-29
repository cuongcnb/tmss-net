import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {GridExportService} from '../../../shared/common-service/grid-export.service';
import {FilterFormCode} from '../../../core/constains/filter-form-code';
import {LoadingService} from '../../../shared/loading/loading.service';
import {VehicleArrivalService} from '../../../api/daily-sale/vehicle-arrival.service';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {GradeListService} from '../../../api/master-data/grade-list.service';
import {ColorListService} from '../../../api/master-data/color-list.service';
import {VehicleArrivalDatepicker} from '../../../core/constains/daily-sale-vehicle-arrival-datepicker';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {DealerAddressDeliveryService} from '../../../api/master-data/dealer-address-delivery.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PaginationParamsModel} from '../../../core/models/base.model';
import {CompareDataService} from '../../../shared/common-service/compare-data.service';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vehicle-arrival',
  templateUrl: './vehicle-arrival.component.html',
  styleUrls: ['./vehicle-arrival.component.scss']
})
export class VehicleArrivalComponent implements OnInit, OnChanges {
  isDlrVehicleArrival: boolean;
  @Input() filterStartForm;
  @Input() currentFilterFormType: string;
  @ViewChild('vehicleArrivalEditModal', {static: false}) vehicleArrivalEditModal;
  @ViewChild('vehicleArrivalImportModal', {static: false}) vehicleArrivalImportModal;
  searchForm: FormGroup;
  paginationParams: PaginationParamsModel;
  paginationTotalsData: number;
  exportParams;
  colorRequestGray: boolean;
  colorDealerDeadline: boolean;

  vehicleArrivalData;
  bottomInfo: {
    assignment: number
    delivery: number
    invoice: number
    moneyAfter: number
    total: number
  };
  vehicleArrivalFieldGrid;
  vehicleArrivalParams;
  rowClassRules;
  selectedVehicleArrival;
  filterFormCode = FilterFormCode;
  currentUser = this.formStoringService.get(StorageKeys.currentUser);
  currentDealer;
  dealerList;
  gradeList;
  colorList;
  deliveryAtArr = [];
  fieldGradeList;
  fieldColorList;
  searchParams;
  filterDataList;
  apiExport = '/vehicle/export-to-excel';
  fileName = 'VehicleArrival.xlsx';

  constructor(
    private gridExportService: GridExportService,
    private formStoringService: FormStoringService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private vehicleArrivalService: VehicleArrivalService,
    private dealerListService: DealerListService,
    private gradeListService: GradeListService,
    private colorListService: ColorListService,
    private dataFormatService: DataFormatService,
    private dealerAddressDeliveryService: DealerAddressDeliveryService,
    private compareDataService: CompareDataService,
    private formBuilder: FormBuilder) {
    this.fieldGradeList = [
      {
        headerName: 'Marketing Code',
        field: 'marketingCode'
      }
    ];
    this.fieldColorList = [
      {
        headerName: 'Code',
        field: 'code'
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.filterStartForm || (this.currentFilterFormType && this.currentFilterFormType !== FilterFormCode.vehicleArrival)) {
      this.filterStartForm = this.formStoringService.get(StorageKeys.vehicleArrivalFilterStart);
    }
    // this.dealerListService.getDealers().subscribe(dealerList => {
    //   this.dealerList = dealerList;
    this.currentDealer = this.dealerList.find(dealer => dealer.id === this.currentUser.dealerId);
    this.resetPaginationParams();

    if (!this.currentFilterFormType || this.currentFilterFormType === FilterFormCode.vehicleArrival) {
      this.search();
    }
    this.dealerList.splice(this.dealerList.indexOf(this.currentDealer), 1);
    // });
  }

  ngOnInit() {
    this.dealerAddressDeliveryService.getAvailableList(this.currentUser.dealerId).subscribe(deliveryAtArr => this.deliveryAtArr = deliveryAtArr);
    this.buildForm();
    const gradeApi = this.currentUser.isAdmin ? this.gradeListService.getGrades(true) : this.currentUser.isLexus
      ? this.gradeListService.getGrades(true, 'lexusOnly')
      : this.gradeListService.getGrades(true, 'notLexus');
    this.dealerListService.getDealers().subscribe(dealerList => {
      this.dealerList = dealerList;
      this.currentDealer = this.dealerList.find(dealer => dealer.id === this.currentUser.dealerId);
    });
    gradeApi.subscribe(grades => {
      this.gradeList = grades;
    });
    this.colorListService.getColorsAvailable().subscribe(colorList => {
      this.colorList = colorList;
    });
    this.isDlrVehicleArrival = !this.currentUser.isAdmin;
    this.vehicleArrivalFieldGrid = [
      {
        headerName: 'Status',
        children: [
          {
            headerName: 'Status',
            field: 'salesStatus',
            pinned: true, resizable: true
          }
        ]
      },
      {
        headerName: 'Vehicle Information',
        children: [
          {field: 'grade', pinned: true, resizable: true},
          {headerName: 'GradeP', field: 'gradePro', pinned: true, resizable: true},
          {headerName: 'Frame', field: 'frameNo', pinned: true, resizable: true},
          {field: 'vin', pinned: true, resizable: true},
          {headerName: 'Engine', field: 'engineNo', pinned: true, resizable: true},
          {headerName: 'IColor', field: 'intColor', pinned: true, resizable: true},
          {headerName: 'EColor', field: 'extColor', cellClass: ['stringType'], pinned: true, resizable: true}
        ]
      },
      {
        headerName: 'Vehicle Information',
        children: [
          {
            headerName: 'TMSS No',
            field: 'tmssNo',
            resizable: true
          },
          {
            headerName: VehicleArrivalDatepicker.dealerRequestColor.headerName,
            field: VehicleArrivalDatepicker.dealerRequestColor.fieldName,
            cellClass: params => {
              return (this.isDlrVehicleArrival && !this.checkColorRequest(params))
                ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right', 'cell-readonly'];
            },
            resizable: true
          },
          {
            field: 'dealerColorDeadline',
            cellClass: () => {
              return (this.colorRequestGray === false)
                ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right', 'cell-readonly'];
            },
            resizable: true
          },
          {
            field: 'dealerColorDeadlineTime',
            valueFormatter: params => this.dataFormatService.formatHoursSecond(params.value),
            cellClass: () => {
              return (this.colorRequestGray === false)
                ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right', 'cell-readonly'];
            },
            resizable: true
          },
          {
            headerName: 'Latest LO Plan Date',
            field: 'latestLoPlanDate',
            cellClass: ['cell-border', 'text-right'],
            resizable: true
          },
          {
            headerName: 'Line Off Date',
            field: 'lineOffDate',
            cellClass: ['cell-border', 'text-right'],
            resizable: true
          },
          {
            headerName: 'CBU ETA',
            field: 'portEta',
            cellClass: ['cell-border', 'text-right'],
            resizable: true
          },
          {
            headerName: 'PDI Date',
            field: 'pdiDate',
            cellClass: ['cell-border', 'text-right'],
            resizable: true
          },
          {
            headerName: 'CBU Document Plan',
            field: 'cbuDocPlan',
            cellClass: ['cell-border', 'text-right'],
            resizable: true
          },
          {
            headerName: 'CBU Document',
            field: 'cbuDocument',
            cellClass: ['cell-border', 'text-right'],
            resizable: true
          }
        ]
      },
      {
        headerName: 'TMV Delivery',
        children: [
          {
            headerName: 'Allo Month',
            field: 'assAlloMonth',
            cellRenderer: params => params.value.toString().slice(3, 6),
            cellClass: ['cell-border', 'text-right'],
            resizable: true
          },
          {
            headerName: 'DLR Dispatch Plan date',
            field: 'dlrDispatchPlan',

            cellClass: ['cell-border', 'text-right'],
            resizable: true
          },
          {
            headerName: 'DLR Dispatch Plan time',
            field: 'dlrDispatchPlanTime',
            valueFormatter: params => this.dataFormatService.formatHoursSecond(params.value),
            cellClass: ['cell-border', 'text-right'],
            resizable: true
          },
          {
            headerName: 'DLR Actual Dispatch date',
            field: 'dealerActualDispatchDate',

            cellClass: ['cell-border', 'text-right'],
            resizable: true
          },
          {
            headerName: 'DLR Actual Dispatch time',
            field: 'dealerActualDispatchTime',
            valueFormatter: params => this.dataFormatService.formatHoursSecond(params.value),
            cellClass: ['cell-border', 'text-right'],
            resizable: true
          },
          {
            headerName: 'DLR Plan Arrival Date',
            field: 'dlrPlanArrivalDate',

            cellClass: ['cell-border', 'text-right'],
            resizable: true
          },
          {
            headerName: 'DLR Plan Arrival Time',
            field: 'dlrPlanArrivalTime',
            valueFormatter: params => this.dataFormatService.formatHoursSecond(params.value),
            cellClass: ['cell-border', 'text-right'],
            resizable: true
          },
          {
            headerName: VehicleArrivalDatepicker.dlrDeliveryAt.headerName,
            field: VehicleArrivalDatepicker.dlrDeliveryAt.fieldName,
            valueFormatter: params => this.dataFormatService.formatDealerAddress(params.value, this.deliveryAtArr ? this.deliveryAtArr : []),
            cellClass: () => {
              return this.isDlrVehicleArrival ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right'];
            },
            resizable: true
          },
          {
            headerName: 'Logistic Company',
            field: 'mlLogisticCompany',
            resizable: true
          },
          {
            headerName: 'Truck Type',
            field: 'mltruckType',
            resizable: true
          },
          {
            headerName: 'Truck Register No',
            field: 'mlTruck',
            resizable: true
          },
          {
            headerName: VehicleArrivalDatepicker.selfDrivingTripRequest.headerName,
            field: VehicleArrivalDatepicker.selfDrivingTripRequest.fieldName,
            cellClass: () => {
              return this.isDlrVehicleArrival ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right'];
            },
            resizable: true
          }
        ]
      },
      {
        headerName: 'DLR Arrival',
        children: [
          {
            headerName: VehicleArrivalDatepicker.dlrArrivalDate.headerName,
            field: VehicleArrivalDatepicker.dlrArrivalDate.fieldName,
            cellClass: () => {
              return this.isDlrVehicleArrival ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right'];
            },
            resizable: true
          },
          {
            headerName: VehicleArrivalDatepicker.dlrArrivalTime.headerName,
            field: VehicleArrivalDatepicker.dlrArrivalTime.fieldName,
            valueFormatter: params => this.dataFormatService.formatHoursSecond(params.value),
            cellClass: () => {
              return this.isDlrVehicleArrival ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right'];
            },
            resizable: true
          }
        ]
      },
      {
        headerName: 'Payment Information',
        children: [
          {
            headerName: 'Payment Plan',
            field: 'dlrPaymentPlan',
            resizable: true,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Defer Payment',
            field: 'dlrDeferPayment',
            resizable: true,
            cellClass: ['cell-border', 'text-right']
          },
          {
            field: 'assignmentDate',
            resizable: true,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: VehicleArrivalDatepicker.invoiceRequestDate.headerName,
            field: VehicleArrivalDatepicker.invoiceRequestDate.fieldName,
            cellClass: () => {
              return this.isDlrVehicleArrival ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right'];
            },
            resizable: true
          },
          {
            headerName: 'Invoice No',
            field: 'payInvoiceNo',
            resizable: true
          },
          {
            headerName: 'Invoice Date',
            field: 'payActualInvoiceDate',
            resizable: true,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'VN Amount',
            field: 'payVnAmount',
            resizable: true
          }
        ]
      },
      {
        headerName: 'Invoice Docs Information',
        children: [
          {
            headerName: 'Doc Delivery',
            field: 'cbuDocDelivery',
            cellClass: ['cell-border', 'text-right'],
            resizable: true
          },
          {
            headerName: VehicleArrivalDatepicker.documentArrivalDate.headerName,
            field: VehicleArrivalDatepicker.documentArrivalDate.fieldName,
            cellClass: () => {
              return this.isDlrVehicleArrival ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right'];
            },
            resizable: true
          },
          {
            headerName: VehicleArrivalDatepicker.documentArrivalTime.headerName,
            field: VehicleArrivalDatepicker.documentArrivalTime.fieldName,
            valueFormatter: params => this.dataFormatService.formatHoursSecond(params.value),
            cellClass: () => {
              return this.isDlrVehicleArrival ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right'];
            },
            resizable: true
          },
          {
            headerName: VehicleArrivalDatepicker.dlrRemark.headerName,
            field: VehicleArrivalDatepicker.dlrRemark.fieldName,
            cellClass: () => {
              return this.isDlrVehicleArrival ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right'];
            },
            resizable: true
          }
        ]
      },
      {
        headerName: 'TFS',
        children: [
          {
            headerName: VehicleArrivalDatepicker.paymentBy.headerName,
            field: VehicleArrivalDatepicker.paymentBy.fieldName,
            cellClass: () => {
              return this.isDlrVehicleArrival ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right'];
            },
            resizable: true
          },
          {
            headerName: 'Amount',
            field: 'tfsAmount',
            resizable: true
          },
          {
            headerName: 'TFSApprove',
            field: 'tfsProcess',
            valueFormatter: params => params.value ?
              params.value === 'Y' ? 'Yes' : 'No' : '',
            resizable: true
          }
        ]
      },
      {
        headerName: 'Fleet Information',
        children: [
          {field: 'fleetPrice', resizable: true},
          {field: 'fleetCustomer', resizable: true}
        ]
      },
      {
        headerName: 'DLR Information',
        children: [
          {
            field: 'salesDate',
            resizable: true,
            cellClass: ['cell-border', 'text-right']
          },
          {field: 'dealer', resizable: true},
          {
            headerName: 'Other Dealer',
            field: 'mlOtherDlrName',
            resizable: true
          },
          {
            headerName: 'Sale To DLR',
            field: 'salesDlr',
            resizable: true
          }
        ]
      },
      {
        headerName: 'Remark',
        children: [
          {field: 'keyCode', resizable: true},
          {
            headerName: VehicleArrivalDatepicker.documentArrivalRemark.headerName,
            field: VehicleArrivalDatepicker.documentArrivalRemark.fieldName,
            cellClass: () => {
              return this.isDlrVehicleArrival ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right'];
            },
            resizable: true
          }
        ]
      }
    ];
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  private buildForm() {
    this.searchForm = this.formBuilder.group({
      colorControl: [undefined],
      gradeControl: [undefined],
      colorId: [undefined],
      gradeId: [undefined],
      dealerId: [undefined],
      type: [this.currentUser.isLexus ? 'L' : undefined],
      searchKey: [undefined]
    });
    if (!this.currentUser.isAdmin) {
      this.searchForm.patchValue({
        dealerId: this.currentUser.dealerId
      });
    }
    this.searchForm.get('type').valueChanges.subscribe(val => {
      this.loadingService.setDisplay(true);
      let listType;
      if (!val) {
        listType = this.currentUser.isAdmin ? undefined : this.currentUser.isLexus ? 'lexusOnly' : 'notLexus';
      } else {
        listType = val;
      }
      this.gradeListService.getGrades(true, listType).subscribe(grades => {
        this.gradeList = grades;
        this.searchForm.patchValue({
          colorId: undefined,
          gradeId: undefined,
          colorControl: undefined,
          gradeControl: undefined
        });
        this.loadingService.setDisplay(false);
      });
    });
    this.searchForm.get('gradeControl').valueChanges.subscribe(value => {
      if (value) {
        this.loadingService.setDisplay(true);
        this.gradeListService.getGradeColor(value.id).subscribe(colorsOfGrade => {
          this.loadingService.setDisplay(false);
          this.colorList = colorsOfGrade;
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
          this.colorList = colors;
        });
      }
    });

    this.searchForm.get('colorControl').valueChanges.subscribe(value => {
      this.searchForm.patchValue({
        colorId: value ? value.id : undefined
      });
    });
  }

  callbackGrid(params) {
    this.vehicleArrivalParams = params;
    this.search();
  }

  changePaginationParams(paginationParams) {
    if (!this.vehicleArrivalData) {
      return;
    }

    this.paginationParams = paginationParams;
    this.search();
  }

  refresh() {
    this.resetPaginationParams();
    this.search();
    this.selectedVehicleArrival = undefined;
  }

  searchWithSaleFilter(filterDataList) {
    this.filterDataList = filterDataList;
    this.resetPaginationParams();
    this.search();
  }

  search() {
    this.searchParams = !this.currentUser.isAdmin ? {
      dealerId: this.currentUser.dealerId
    } : null;
    this.searchParams = Object.assign({}, this.searchParams, this.searchForm.value, {
      gradeControl: undefined,
      colorControl: undefined
    });

    this.loadingService.setDisplay(true);
    this.vehicleArrivalService.searchVehicleArrival(this.filterStartForm, this.searchParams, this.filterDataList, this.paginationParams).subscribe(vehicleArrivalData => {
      this.loadingService.setDisplay(false);
      this.paginationTotalsData = vehicleArrivalData ? vehicleArrivalData.total : 0;
      this.vehicleArrivalData = vehicleArrivalData ? vehicleArrivalData.vehicleList : [];
      this.bottomInfo = vehicleArrivalData ? vehicleArrivalData.bottomInfo : [];

      setTimeout(() => {
        if (this.vehicleArrivalParams) {
          this.vehicleArrivalParams.api.setRowData(this.vehicleArrivalData);
          this.setFilterModel(this.vehicleArrivalParams);
          const allColumnIds = [];
          this.vehicleArrivalParams.columnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));
          this.vehicleArrivalParams.columnApi.autoSizeColumns(allColumnIds);
        }
      }, 500);
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

  checkColorRequest(params) {
    if (params.data.lineOffDate) {
      return true;
    }
    if (!params.data.dealerColorDeadline || !params.data.dealerColorDeadlineTime) {
      return false;
    } else {
      const hours = Math.floor(params.data.dealerColorDeadlineTime / 3600);
      const minutes = Math.floor((params.data.dealerColorDeadlineTime % 3600) / 60);
      const seconds = params.data.dealerColorDeadlineTime % 60;

      if (new Date(params.data.dealerColorDeadline.concat(` ${hours}:${minutes}:${seconds}`)) < new Date()) {
        return true;
      }
    }
  }

  agCellDoubleClicked(params) {
    // Get selected row
    const selectedVehicleArrival = this.vehicleArrivalParams.api.getSelectedRows();
    if (selectedVehicleArrival) {
      this.selectedVehicleArrival = selectedVehicleArrival[0];
    }
    // Trigger edit modal
    const column = params.colDef.field;
    if (this.isDlrVehicleArrival) {
      for (const key in VehicleArrivalDatepicker) {
        if (column === VehicleArrivalDatepicker[key].fieldName) {
          // Xe co status la SL thi khong duoc edit
          // if (params.data.salesStatus === 'SL') {
          //   this.swalAlertService.openFailModal('Can not edit Sale vehicle (status = SL)');
          //   return;
          // }
          // Dieu kien Invoice Request
          if (column === VehicleArrivalDatepicker.invoiceRequestDate.fieldName) {
            if (params.data.payInvoiceNo || params.data.payActualInvoiceDate) {
              this.swalAlertService.openFailModal('Can not edit vehicle that already has Invoice No and Invoice Date');
              return;
            }
            if (params.data.cbuCkd !== 'N' && !params.data.cbuDocDelivery) { // doc delivery
              this.swalAlertService.openFailModal('CBU Vehicle - Doc Delivery is blank');
              return;
            }
            if (params.data.cbuCkd === 'N' && !params.data.lineOffDate) {
              this.swalAlertService.openFailModal('CKD Vehicle - Line Of Date is blank');
              return;
            }
          }
          // Dieu kien edit cot Color Request
          if (column === VehicleArrivalDatepicker.dealerRequestColor.fieldName) {
            if (params.data.lineOffDate) {
              this.colorRequestGray = true;
              this.swalAlertService.openFailModal('This vehicle is already Line Off Date');
              return;
            }
            if (!params.data.dealerColorDeadline || !params.data.dealerColorDeadlineTime) {
              this.swalAlertService.openFailModal('This vehicle does not have Dealer Color Deadline or Dealer Color Deadline Time');
              return;
            } else {
              const hours = Math.floor(params.data.dealerColorDeadlineTime / 3600);
              const minutes = Math.floor((params.data.dealerColorDeadlineTime % 3600) / 60);
              const seconds = params.data.dealerColorDeadlineTime % 60;

              if (new Date(params.data.dealerColorDeadline.concat(` ${hours}:${minutes}:${seconds}`)) < new Date()) {
                this.colorDealerDeadline = true;
                this.swalAlertService.openFailModal('Over Color Request deadline');
                return;
              }
            }
          }

          // Dieu kien cot Self Driving Trip Request
          // if (column === VehicleArrivalDatepicker.selfDrivingTripRequest.fieldName) {
          //   if (!params.data.dlrDispatchPlan) {
          //     this.swalAlertService.openFailModal('This vehicle does not have Dispatch Plan Date');
          //     return;
          //   }
          //
          //   const sourceDate = new FirefoxDate(params.data.dlrDispatchPlan).newDate();
          //   const conditionDate = sourceDate.getDay() === 0
          //     ? this.compareDataService.calculateDate(sourceDate, -2)
          //     : this.compareDataService.calculateDate(sourceDate, -1);
          //   const currentDate = new Date();
          //   const currentTime = new Date().getHours() + ':' + new Date().getMinutes();
          //
          //   if (params.data.dlrDispatchPlan) {
          //     if (this.compareDataService.compareTwoDate(conditionDate, currentDate) < 0
          //       || (this.compareDataService.compareTwoDate(conditionDate, currentDate) === 0
          //         && this.compareDataService.compareTwoTime(currentTime, '8:00') > 0)) {
          //       this.swalAlertService.openFailModal('Over deadline');
          //       return;
          //     }
          //   }
          // }

          if (column === VehicleArrivalDatepicker.paymentBy.fieldName && params.data.tfsProcess === 'Y') {
            this.swalAlertService.openFailModal('Can not change Approved Payment Method by TMV');
            return;
          }
          this.vehicleArrivalEditModal.open(this.selectedVehicleArrival, VehicleArrivalDatepicker[key].fieldName, VehicleArrivalDatepicker[key].headerName);
        }
      }
    }
  }

  setDataToRow(vehicleArrivalData) {
    const index = this.vehicleArrivalData.indexOf(this.selectedVehicleArrival);
    this.vehicleArrivalData[index] = vehicleArrivalData.value;
    this.vehicleArrivalParams.api.setRowData(this.vehicleArrivalData);
  }

  exportToExcel() {
    this.paginationParams = this.paginationParams || {
      sortType: null,
      page: 1,
      size: 20,
      filters: [],
      fieldSort: null
    };
    let filterVehicleArrivalInside = {
      filterDataList: this.filterDataList ? this.filterDataList : [],
      filterVehicleArrival: this.filterStartForm
    };
    filterVehicleArrivalInside = Object.assign({}, filterVehicleArrivalInside, this.paginationParams, this.searchParams);
    if (this.paginationParams.page === 0) {
      this.paginationParams.page = 1;
    }
    this.gridExportService.onExportFile(this.apiExport, filterVehicleArrivalInside, this.fileName);
  }
}
