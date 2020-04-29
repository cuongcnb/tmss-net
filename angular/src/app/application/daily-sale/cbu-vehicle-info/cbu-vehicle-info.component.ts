import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {CbuVehicleInfoService} from '../../../api/daily-sale/cbu-vehicle-info.service';
import {GridExportService} from '../../../shared/common-service/grid-export.service';
import {UserColumnService} from '../../../api/admin/user-column.service';
import {FilterFormCode} from '../../../core/constains/filter-form-code';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {GradeListService} from '../../../api/master-data/grade-list.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {EditTypeOfCellVehicleInfo} from '../../../core/constains/cbu-lexus-ckd-field';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {TMSSTabs} from '../../../core/constains/tabs';
import {ImportTemplate, ImportType} from '../../../core/constains/import-types';
import {ImportService} from '../../../api/import/import.service';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {PaginationParamsModel} from '../../../core/models/base.model';
import {CompareDataService} from '../../../shared/common-service/compare-data.service';
import {TransportTypeService} from '../../../api/master-data/transport-type.service';
import {ToastService} from '../../../shared/common-service/toast.service';
import {AgDatepickerRendererComponent} from '../../../shared/ag-datepicker-renderer/ag-datepicker-renderer.component';
import {GradeListModel} from '../../../core/models/sales/model-list.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cbu-vehicle-info',
  templateUrl: './cbu-vehicle-info.component.html',
  styleUrls: ['./cbu-vehicle-info.component.scss']
})
export class CbuVehicleInfoComponent implements OnInit, OnChanges {
  @ViewChild('cbuDisplayChoosingModal', {static: false}) cbuDisplayChoosingModal;
  @ViewChild('editModal', {static: false}) editModal;
  @ViewChild('fileInput', {static: false}) fileInput;
  @ViewChild('confirmRejectModal', {static: false}) confirmRejectModal;
  @Input() isCbu: boolean;
  @Input() currentFilterFormType: string;
  @Input() selectedTab;
  @Input() filterStartFormCbu;
  @Input() filterStartFormCkd;
  bottomInfo: {
    nonAssignment: number
    rfPayment: number
    total: number
  };
  searchParams;
  currentCbuFilter;
  currentCkdFilter;
  globalFilter;
  importTemplate = ImportTemplate;
  paginationParams: PaginationParamsModel;
  paginationTotalsData: number;
  filterDataList = [];

  exportParams;
  uploader: FileUploader;
  // Search form in top page
  formName: string; // CBU or CKD
  quickSearchKey: string;
  selectedDealer;
  gradeList;
  selectedGrade: GradeListModel;
  gridLoaded = false;
  vehicleInfoData;
  filterIdStartList: Array<any>; // List data filter form input (using in search function)

  // Field to display
  FullCbuVehicleFields;
  FullCkdVehicleFields;

  allFieldGrid;
  fieldGridCustomInfo;

  customInfoParams;
  customInfoParamsCbu;
  customInfoParamsCkd;
  selectedData;

  importType = ImportType;
  selectedImportType;
  pageTitle: string;
  filterFormCode = FilterFormCode;

  // Danh sach cot lay cua API
  editableColumn = [];
  rowClassRules;
  CanEditCondition = {
    tmssNo: [
      {
        condition: (matchData, paramData) => matchData.field === 'tmssNo',
        failText: 'Giá trị TMSS No được bảo vệ, không được cập nhật'
      }
    ],
    dealerRequestColor: [
      {
        condition: (matchData, paramData) => matchData.field === 'dealerRequestColor' && (paramData.dealer && paramData.dealer !== 'TMV'),
        failText: 'Chỉ được đổi màu cho xe của TMV'
      },
      {
        condition: (matchData, paramData) => matchData.field === 'dealerRequestColor' && paramData.lineOffDate,
        failText: 'Xe đã xuất xưởng'
      },
      {
        condition: (matchData, paramData) => matchData.field === 'dealerRequestColor' && !paramData.lineOffDate
          && (!paramData.dealerColorDeadline || !paramData.dealerColorDeadlineTime),
        failText: 'Chưa có thông tin Color Deadline, Color Deadline Time'
      },
      {
        condition: (matchData, paramData) => {
          return matchData.field === 'dealerRequestColor' && paramData.dealerColorDeadline
            && (
              this.compareDataService.compareTwoDate(new Date(paramData.dealerColorDeadline), new Date()) < 0
              || (
                this.compareDataService.compareTwoDate(new Date(paramData.dealerColorDeadline), new Date()) === 0
                && paramData.dealerColorDeadlineTime
                && this.compareDataService.compareTwoTime(
                  this.dataFormatService.formatHoursSecond(paramData.dealerColorDeadlineTime),
                  new Date().getHours() + ':' + new Date().getMinutes()) < 0
              )
            );
        },
        failText: 'Đã quá hạn để cập nhật'
      }
    ],
    extColor: [
      {
        condition: (matchData, paramData) => matchData.field === 'extColor' && paramData.lineOffDate,
        failText: 'Xe đã xuất xưởng'
      }
    ],
    intColor: [
      {
        condition: (matchData, paramData) => matchData.field === 'intColor' && paramData.lineOffDate,
        failText: 'Xe đã xuất xưởng'
      }
    ],
    dlrPaymentPlan: [
      {
        condition: (matchData, paramData) => matchData.field === 'dlrPaymentPlan' && (paramData.payActualInvoiceDate || paramData.payInvoiceNo),
        failText: 'Xe đã có thông tin xuất hóa đơn'
      }],
    payInvoiceNo: [
      {
        condition: (matchData, paramData) => matchData.field === 'payInvoiceNo' && (paramData.payActualInvoiceDate && paramData.payInvoiceNo),
        failText: 'Xe đã có thông tin xuất hóa đơn'
      }],
    payActualInvoiceDate: [
      {
        condition: (matchData, paramData) => matchData.field === 'payActualInvoiceDate' && (paramData.payActualInvoiceDate && paramData.payInvoiceNo),
        failText: 'Xe đã có thông tin xuất hóa đơn'
      }],
    dealer: [
      {
        condition: (matchData, paramData) => matchData.field === 'dealer' && (paramData.payActualInvoiceDate || paramData.payInvoiceNo),
        failText: 'Xe đã có thông tin xuất hóa đơn'
      }
    ],
    assDealerChangeFromName: [
      {
        condition: (matchData, paramData) => matchData.field === 'assDealerChangeFromName' && (paramData.payActualInvoiceDate || paramData.payInvoiceNo),
        failText: 'Xe đã có thông tin xuất hóa đơn'
      }
    ],
    assDealerChangeFrom: [
      {
        condition: (matchData, paramData) => matchData.field === 'assDealerChangeFrom' && (paramData.payActualInvoiceDate || paramData.payInvoiceNo),
        failText: 'Xe đã có thông tin xuất hóa đơn'
      }
    ],
    mlOtherDlrName: [
      {
        condition: (matchData, paramData) => matchData.field === 'mlOtherDlrName' && (paramData.payActualInvoiceDate || paramData.payInvoiceNo),
        failText: 'Xe đã có thông tin xuất hóa đơn'
      }
    ],
    invoiceRequestDate: [
      {
        condition: (matchData, paramData) => matchData.field === 'invoiceRequestDate' && paramData.payInvoiceNo,
        failText: `Xe đã xuất hóa đơn`
      },
      {
        condition: (matchData, paramData) => matchData.field === 'invoiceRequestDate' && !paramData.payInvoiceNo && !paramData.lineOffDate && !this.isCbu,
        failText: `Phải chọn Line Off Date`
      },
      {
        condition: (matchData, paramData) => matchData.field === 'invoiceRequestDate' && !paramData.payInvoiceNo && !paramData.cbuDocDelivery && this.isCbu,
        failText: `Phải chọn Doc Delivery`
      },
      {
        condition: (matchData, paramData) => matchData.field === 'invoiceRequestDate' && !paramData.assAlloMonth,
        failText: `Chưa có thông tin Allocation month`
      }
    ],
    originDocPlan: [
      {
        condition: (matchData, paramData) => matchData.field === 'originDocPlan' && paramData.originDocPlan,
        failText: `Không được phép cập nhật`
      }
    ],
    dlrDeliveryAt: [
      {
        condition: (matchData, paramData) => {
          return matchData.field === 'dlrDeliveryAt' && this.isCbu && paramData.dlrDispatchPlan
            && (
              this.compareDataService.compareTwoDate(this.compareDataService.calculateDate(new Date(paramData.dlrDispatchPlan), -1), new Date()) < 0
              || (
                this.compareDataService.compareTwoDate(this.compareDataService.calculateDate(new Date(paramData.dlrDispatchPlan), -1), new Date()) === 0
                && this.compareDataService.compareTwoTime(new Date().getHours() + ':' + new Date().getMinutes(), '08:00') > 0
              )
            );
        },
        failText: `Đã quá hạn để cập nhật`
      },
      {
        condition: (matchData, paramData) => {
          return matchData.field === 'dlrDeliveryAt' && !this.isCbu && paramData.mlPlanDeliveryDate
            && (
              this.compareDataService.compareTwoDate(this.compareDataService.calculateDate(new Date(paramData.mlPlanDeliveryDate), -1), new Date()) < 0
              || (
                this.compareDataService.compareTwoDate(this.compareDataService.calculateDate(new Date(paramData.mlPlanDeliveryDate), -1), new Date()) === 0
                && this.compareDataService.compareTwoTime(new Date().getHours() + ':' + new Date().getMinutes(), '08:00') > 0
              )
            );
        },
        failText: `Đã quá hạn để cập nhật`
      }
    ]
  };

  transportTypeAvailable;
  dealersAvailable;

  frameworkComponents;
  editedRows = [];
  column;

  constructor(
    private gridExportService: GridExportService,
    private loadingService: LoadingService,
    private userColumnService: UserColumnService,
    private dealerListService: DealerListService,
    private cbuVehicleInfoService: CbuVehicleInfoService,
    private swalAlertService: ToastService,
    private formStoringService: FormStoringService,
    private importService: ImportService,
    private dataFormatService: DataFormatService,
    private compareDataService: CompareDataService,
    // Những service được sử dụng trong EditTypeOfCellVehicleInfo
    private transportTypeService: TransportTypeService,
    private gradeListService: GradeListService
  ) {
    this.FullCbuVehicleFields = [
      {
        groupId: 'pinned',
        field: 'vehicleInformationGroup',
        children: [
          {
            headerName: 'CKD/CBU/Lexus',
            field: 'cbuCkd',
            cellRenderer: params => this.getTypeCbuCkd(params.data.cbuCkd),
            resizable: true,
            pinned: true
          },
          {
            headerName: 'Status',
            field: 'vehicleStatusName',
            resizable: true,
            pinned: true
          },
          {
            field: 'gradePro',
            resizable: true,
            pinned: true
          },
          {
            field: 'grade',
            resizable: true,
            pinned: true
          },
          {
            headerName: 'VIN',
            field: 'vin',
            resizable: true,
            pinned: true
          },
          {
            field: 'frameNo',
            resizable: true,
            pinned: true,
            cellClass: ['cell-border', 'text-right']
          },
          {
            field: 'engineNo',
            resizable: true,
            pinned: true
          },
          {
            headerName: 'Key Code',
            field: 'keyCode',
            resizable: true,
            pinned: true,
            cellClass: ['cell-clickable', 'cell-border'],
            editType: 'text',
            canUpdate: true
            // editable: true
          },
          {
            headerName: 'Int Color',
            field: 'intColor',
            fieldSubmit: 'colorId',
            resizable: true,
            pinned: true,
            cellClass: ['cell-clickable', 'cell-border'],
            editType: 'list',
            canUpdate: true,
            gridField: [
              {field: 'code'},
              {headerName: 'Vietnamese Name', field: 'vnName'},
              {headerName: 'English Name', field: 'enName'},
              {field: 'description'}
            ],
            displayField: 'code',
            apiCall: 'getIntColorsForCbuCkd'
          },
          {
            headerName: 'EXT Color',
            field: 'extColor',
            fieldSubmit: 'colorId',
            resizable: true,
            pinned: true,
            cellClass: ['cell-clickable', 'cell-border'],
            editType: 'list',
            canUpdate: true,
            gridField: [
              {field: 'code'},
              {headerName: 'Vietnamese Name', field: 'vnName'},
              {headerName: 'English Name', field: 'enName'},
              {field: 'description'}
            ],
            displayField: 'code',
            apiCall: 'getColorsForCbuCkd'
          },
          {
            headerName: 'Line Off Month',
            field: 'cbuProductionMonth',
            resizable: true,
            pinned: true,
            cellClass: ['cell-clickable', 'cell-border'],
            editType: 'monthPicker',
            // cellRenderer: 'agDatepickerRendererComponent',
            canUpdate: true,
            valueFormatter: params => this.dataFormatService.parseDateToDateString(params.value)
          }
        ]
      }
    ];
    this.FullCkdVehicleFields = [
      {
        groupId: 'pinned',
        field: 'vehicleInformationGroup',
        children: [
          {
            headerName: 'CKD/CBU/Lexus',
            field: 'cbuCkd',
            cellRenderer: params => this.getTypeCbuCkd(params.data.cbuCkd),
            resizable: true,
            pinned: true
          },
          {
            field: 'gradePro',
            resizable: true,
            pinned: true
          },
          {
            field: 'grade',
            resizable: true,
            pinned: true
          },
          {
            field: 'frameNo',
            resizable: true,
            pinned: true
          },
          {
            headerName: 'VIN',
            field: 'vin',
            resizable: true,
            pinned: true
          },
          {
            field: 'engineNo',
            resizable: true,
            pinned: true
          },
          {
            headerName: 'Eng Code',
            field: 'engCode',
            resizable: true,
            pinned: true
          },
          {
            headerName: 'Color',
            field: 'extColor',
            fieldSubmit: 'colorId',
            resizable: true,
            pinned: true,
            cellClass: ['cell-clickable', 'cell-border'],
            editType: 'list',
            canUpdate: true,
            gridField: [
              {field: 'code'},
              {headerName: 'Vietnamese Name', field: 'vnName'},
              {headerName: 'English Name', field: 'enName'},
              {field: 'description'}
            ],
            displayField: 'code',
            apiCall: 'getColorsForCbuCkd'
          }
        ]
      }
    ];
  }

  ngOnInit() {
    this.initUploader();
    this.loadingService.setDisplay(true);
    this.pageTitle = this.isCbu ? 'CBU Vehicle Information' : 'CKD Vehicle Information';
    this.formName = this.isCbu ? 'cbu' : 'ckd';
    this.setColorRow();
    combineLatest([
      this.dealerListService.getAvailableDealers(),
      this.gradeListService.getGradesByForm(this.formName),
      this.transportTypeService.getAllTransportType()
    ]).pipe(
      map(([dealers, grades, transportTypes]) => {
        this.dealersAvailable = dealers;
        this.gradeList = grades;
        this.transportTypeAvailable = transportTypes;
      })
    ).subscribe(() => {
      this.getColumnsAuthorize();
      this.searchVehicles(this.isCbu ? this.currentCbuFilter : this.currentCkdFilter);
    });
    this.frameworkComponents = {
      // agSelectRendererComponent: AgSelectRendererComponent,
      agDatepickerRendererComponent: AgDatepickerRendererComponent
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isCbu && (!this.filterStartFormCbu || (this.currentFilterFormType && this.currentFilterFormType !== FilterFormCode.cbuVehicleInfo))) {
      this.filterStartFormCbu = this.formStoringService.get(StorageKeys.cbuFilterStartModal);
    }
    if (!this.isCbu && (!this.filterStartFormCkd || (this.currentFilterFormType && this.currentFilterFormType !== FilterFormCode.ckdVehicleInfo))) {
      this.filterStartFormCkd = this.formStoringService.get(StorageKeys.ckdFilterStartModal);
    }

    // Kiểm tra nếu filter start modal thay đổi thông tin thì mới thực hiện gọi API
    if (this.currentCbuFilter && JSON.stringify(this.currentCbuFilter) === JSON.stringify(this.filterStartFormCbu)) {
      return;
    } else {
      if (this.filterStartFormCbu) {
        this.currentCbuFilter = this.filterStartFormCbu;
        this.formName = 'cbu';
        this.resetPaginationParams();
        setTimeout(() => {
          if (!this.currentFilterFormType || this.currentFilterFormType === FilterFormCode.cbuVehicleInfo) {
            this.searchVehicles(this.currentCbuFilter);
          }
        }, 1500);
      }
    }

    if (this.currentCkdFilter && JSON.stringify(this.currentCkdFilter) === JSON.stringify(this.filterStartFormCkd)) {
      return;
    } else {
      if (this.filterStartFormCkd) {
        this.currentCkdFilter = this.filterStartFormCkd;
        this.formName = 'ckd';
        this.resetPaginationParams();
        setTimeout(() => {
          if (!this.currentFilterFormType || this.currentFilterFormType === FilterFormCode.ckdVehicleInfo) {
            this.searchVehicles(this.currentCkdFilter);
          }
        }, 1500);
      }
    }
  }

  getTypeCbuCkd(cbuCkd: string): string {
    switch (cbuCkd) {
      case 'Y':
        return 'CBU';
      case 'L':
        return 'Lexus';
      default:
        return 'CKD';
    }
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  changePaginationParams(paginationParams) {
    if (!this.vehicleInfoData) {
      return;
    }

    this.paginationParams = paginationParams;
    this.searchVehicles(this.globalFilter);
  }

  searchWithSaleFilter(filterDataList) {
    this.resetPaginationParams();
    this.filterDataList = filterDataList;
    this.searchVehicles(this.globalFilter);
  }

  searchVehicles(globalFilter?) {
    if (globalFilter) {
      this.globalFilter = globalFilter;
    }

    // Get search Filter
    this.searchParams = {
      dealerId: this.selectedDealer ? this.selectedDealer : null,
      keyword: this.quickSearchKey ? this.quickSearchKey : null,
      gradeId: this.selectedGrade ? this.selectedGrade : null
    };

    // Filter
    this.loadingService.setDisplay(true);
    this.cbuVehicleInfoService.search(this.formName, globalFilter, this.searchParams, this.filterDataList, this.paginationParams)
      .subscribe(response => {
        this.bottomInfo = response.bottomInfo;
        if (response) {
          this.paginationTotalsData = response.bottomInfo ? response.bottomInfo.total : 0;
          this.vehicleInfoData = response.vehicles.map(data => data.vehicle);
          this.filterIdStartList = response.vehicles.map(data => data.vehicle.id);
          if (this.vehicleInfoData) {
            if (this.selectedTab === TMSSTabs.cbuVehicleInfo) {
              if (this.customInfoParamsCbu) {
                this.customInfoParamsCbu.api.setRowData(this.vehicleInfoData);
                const allColumnIds = [];
                this.customInfoParamsCbu.columnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));
                this.customInfoParamsCbu.columnApi.autoSizeColumns(allColumnIds);
                this.setFilterModel(this.customInfoParamsCbu);
              }
            } else {
              if (this.customInfoParamsCkd) {
                this.customInfoParamsCkd.api.setRowData(this.vehicleInfoData);
                const allColumnIds = [];
                this.customInfoParamsCkd.columnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));
                this.customInfoParamsCkd.columnApi.autoSizeColumns(allColumnIds);
                this.setFilterModel(this.customInfoParamsCkd);
              }
            }
          }
        }
        this.loadingService.setDisplay(false);
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

  importExcel(type) {
    this.selectedImportType = type;
    this.fileInput.nativeElement.click();
  }

  getImportTemplate(type) {
    this.loadingService.setDisplay(true);
    this.importService.downloadTemplate(type).subscribe(data => {
      this.loadingService.setDisplay(false);
      this.downloadFile(data);
    });
  }

  downloadFile(data) {
    const fileName = data.headers.get('content-disposition').replace('attachment;filename=', '');
    const link = document.createElement('a');
    const url = URL.createObjectURL(data.body);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  initUploader() {
    this.uploader = new FileUploader({url: '/'});
    this.uploader.onBeforeUploadItem = item => item.withCredentials = false;
    const token = JSON.parse(localStorage.getItem(StorageKeys.currentUser)).token;
    this.uploader.setOptions({authToken: `Bearer ${token}`});
  }

  onChangeFile(event: Event) {
    const input = event.target as HTMLInputElement;

    this.loadingService.setDisplay(true);
    switch (this.selectedImportType) {
      case ImportType.customerInfo:
        this.importService.importCbuCustomerInfo(this.uploader);
        break;
      case ImportType.deliveryRouteDLR:
        this.importService.importCbuDeliveryRouteDlr(this.uploader);
        break;
      case ImportType.fixPaymentDeadline:
        this.importService.importFixPaymentDeadline(this.uploader);
        break;
    }
    this.uploader.onErrorItem = ((item: FileItem, res: string, status: number, heanders: ParsedResponseHeaders): any => {
      let message = '';
      if (res) {
        const err = JSON.parse(res);
        if (err.message) {
          message = err.message;
        } else {
          err.forEach(text => message += `<div>${text}</div>`);
        }
      }
      this.fileInput.nativeElement.value = '';
      this.loadingService.setDisplay(false);
      this.initUploader();
      this.swalAlertService.openFailModal(message, 'Import Error');
    });
    this.uploader.onSuccessItem = ((item: FileItem, res: string, status: number, heanders: ParsedResponseHeaders): any => {
      let message;
      try {
        message = JSON.parse(res).message;
      } catch (err) {
      }
      this.fileInput.nativeElement.value = '';
      this.loadingService.setDisplay(false);
      this.initUploader();
      this.swalAlertService.openSuccessModal(message, 'Import Success');
      this.resetPaginationParams();
      this.searchVehicles(this.isCbu ? this.currentCbuFilter : this.currentCkdFilter);
    });
  }

  getColumnsAuthorize() {
    this.fieldGridCustomInfo = this.isCbu ? this.FullCbuVehicleFields : this.FullCkdVehicleFields;
    this.allFieldGrid = this.isCbu ? this.FullCbuVehicleFields : this.FullCkdVehicleFields;
    this.editableColumn = undefined;
    this.loadingService.setDisplay(true);
    this.userColumnService.getColumnsAuthorize(this.formName)
      .subscribe(groupColumns => {
        this.loadingService.setDisplay(true);
        if (groupColumns && groupColumns !== []) {
          const groupCol = groupColumns.groups.filter(group => group.groupCode !== 'VEHICLES');
          this.allFieldGrid = [...this.allFieldGrid, ...this.generateGroupCol(groupCol)];
          this.generateEditableCol(this.allFieldGrid);
          this.getFieldToDisplay();
        } else {
          this.generateEditableCol(this.allFieldGrid);
          this.getFieldToDisplay();
        }
      });
  }

  getFieldToDisplay() {
    this.loadingService.setDisplay(true);
    const displayField = this.generateDisplayField(this.generateGroupChosenToDisplayField());
    if (displayField.length === 0) {
      this.fieldGridCustomInfo = this.allFieldGrid;
    } else {
      this.fieldGridCustomInfo = displayField;
    }
    this.gridLoaded = false;
    setTimeout(() => {
      this.gridLoaded = true;
    }, 200);
  }

  callbackGridCustomInfoCbu(params) {
    this.customInfoParams = params;
    this.customInfoParamsCbu = this.isCbu ? params : undefined;
    // Khi chọn các group được hiển thị thì load lại grid-table-component và gán lại dữ liệu
    if (this.vehicleInfoData) {
      this.loadingService.setDisplay(false);
      this.customInfoParams.api.setRowData(this.vehicleInfoData);
    }
  }

  callbackGridCustomInfoCkd(params) {
    this.customInfoParams = params;
    this.customInfoParamsCkd = !this.isCbu ? params : undefined;
    // Khi chọn các group được hiển thị thì load lại grid-table-component và gán lại dữ liệu
    if (this.vehicleInfoData) {
      this.loadingService.setDisplay(false);
      this.customInfoParams.api.setRowData(this.vehicleInfoData);
    }
  }

  getExportParams(params) {
    this.exportParams = params;
  }

  confirmExport() {
    this.confirmRejectModal.show();
  }

  onBtnExport() {
    this.loadingService.setDisplay(true);
    this.cbuVehicleInfoService.search(this.formName, this.globalFilter, this.searchParams, this.filterDataList, {filters: []})
      .subscribe(res => {
        this.bottomInfo = res.bottomInfo;
        this.loadingService.setDisplay(false);
        const result = [];
        if (res && res.vehicles) {
          for (const item of res.vehicles) {
            item.vehicle.cbuCkd = this.getTypeCbuCkd(item.vehicle.cbuCkd);
            result.push(item.vehicle);
          }
        }
        this.exportParams.columnApi.columnController.gridOptionsWrapper.gridOptions.excelStyles = [
          {
            id: 'cell-border',
            dataType: 'string',
            font: {
              size: 11,
            },
            alignment: {
              horizontal: 'Center', vertical: 'Center'
            },
            borders: {
              borderBottom: {
                color: '#212121',
                lineStyle: 'Continuous',
                weight: 1
              },
              borderLeft: {
                color: '#212121',
                lineStyle: 'Continuous',
                weight: 1
              },
              borderRight: {
                color: '#212121',
                lineStyle: 'Continuous',
                weight: 1
              },
              borderTop: {
                color: '#212121',
                lineStyle: 'Continuous',
                weight: 1
              }
            }
          },
          {
            id: 'stringType',
            font: {
              size: 11,
            },
            alignment: {
              horizontal: 'Center', vertical: 'Center'
            },
            borders: {
              borderBottom: {
                color: '#212121',
                lineStyle: 'Continuous',
                weight: 1
              },
              borderLeft: {
                color: '#212121',
                lineStyle: 'Continuous',
                weight: 1
              },
              borderRight: {
                color: '#212121',
                lineStyle: 'Continuous',
                weight: 1
              },
              borderTop: {
                color: '#212121',
                lineStyle: 'Continuous',
                weight: 1
              }
            }
          },
          {
            id: 'header',
            font: {
              bold: true,
              size: 11,
            },
            interior: {
              color: '#bdbdbd',
              pattern: 'Solid'
            },
            alignment: {
              horizontal: 'Center', vertical: 'Center'
            },
            borders: {
              borderBottom: {
                color: '#212121',
                lineStyle: 'Continuous',
                weight: 1
              },
              borderLeft: {
                color: '#212121',
                lineStyle: 'Continuous',
                weight: 1
              },
              borderRight: {
                color: '#212121',
                lineStyle: 'Continuous',
                weight: 1
              },
              borderTop: {
                color: '#212121',
                lineStyle: 'Continuous',
                weight: 1
              }
            }
          },
        ];
        this.exportParams.api.setRowData(result);
        const allColumnIds = [];
        this.exportParams.columnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));
        this.exportParams.columnApi.autoSizeColumns(allColumnIds);
        this.gridExportService.export(this.exportParams, 'Vehicles Info');
      });
  }

  agCellDoubleClicked(params) {
    const selectedData = params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
      const matchData = this.editableColumn.find(item => params.colDef.field === item.field);
      let canEdit = true;
      if (matchData) {
        // Kiểm tra điều kiện đặc biệt mới cho phép update
        if (this.CanEditCondition[matchData.field]) {
          this.CanEditCondition[matchData.field].forEach(checkCondition => {
            if (checkCondition.condition(matchData, params.data)) {
              canEdit = false;
              this.swalAlertService.openFailModal(checkCondition.failText);
            }
          });
        }
        if (canEdit) {
          this.editModal.open(this.isCbu, matchData, this.selectedData);
        }
      }
    }
  }

  setDataToRow(event) {
    const index = this.vehicleInfoData.indexOf(this.selectedData);
    this.vehicleInfoData[index] = event.data;
    this.save([{vehicle: event.data}], event.fieldSubmit);
  }

  save(data, fieldSubmit) {
    this.loadingService.setDisplay(true);
    this.cbuVehicleInfoService.saveChanges(this.formName, [
      {
        vehicle: {
          id: data[0].vehicle.id,
          [fieldSubmit]: data[0].vehicle[fieldSubmit]
        }
      }
    ]).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.searchVehicles(this.isCbu ? this.currentCbuFilter : this.currentCkdFilter);
      res.message.toLowerCase() === 'success' ? this.swalAlertService.openSuccessModal() : this.swalAlertService.openWarningModal(res.message);
      this.setFilterModel(this.customInfoParams);
    });
  }

  private setColorRow() {
    this.rowClassRules = {
      'is-warning': (params) => {
        let selectedDateTime;
        if (params.data.mlPlanDeliveryDate && params.data.mlPlanDeliveryTime) {
          const dateParams = new Date(params.data.mlPlanDeliveryDate);
          const time = params.data.mlPlanDeliveryTime ? this.dataFormatService.formatHoursSecond(params.data.mlPlanDeliveryTime) : '';
          const timeParams = time ? time.split(':') : [];
          if (dateParams && timeParams.length >= 2) {
            selectedDateTime = new Date(+dateParams.getFullYear(), +dateParams.getMonth(), +dateParams.getDate(), +timeParams[0], +timeParams[1]);
          }
          if (selectedDateTime && this.compareDataService.compareTwoDate(new Date(), selectedDateTime) === 0 && selectedDateTime.getTime() > new Date().getTime()) {
            return true;
          }
        }
        return false;
      }
    };
  }

  private generateGroupCol(grCol) {
    // return grCol.map(gr => ({ groupId: gr.groupId, field: gr.groupCode, children: this.generateCol(gr.columns) }));
    return grCol.map(gr => ({
      groupId: gr.groupId,
      field: gr.groupCode,
      children: this.generateCol(gr.columns)
    }));
  }

  private generateCol(columns) {
    const orderFirst = columns.filter(col => col.order);
    const orderAfter = columns.filter(col => !col.order);
    let colView = [];
    const editable = (value) => value === 'Y';
    const editableColorDeadline = (params) => {
      return (params.colDef.field === 'dealerColorDeadline' || params.colDef.field === 'dealerColorDeadlineTime' || params.colDef.field === 'dealerRequestColor')
        && params.data.dealerColorDeadline
        && (this.compareDataService.compareTwoDate(new Date(params.data.dealerColorDeadline), new Date()) < 0
          || (this.compareDataService.compareTwoDate(new Date(params.data.dealerColorDeadline), new Date()) === 0
            && params.data.dealerColorDeadlineTime
            && this.compareDataService.compareTwoTime(
              this.dataFormatService.formatHoursSecond(params.data.dealerColorDeadlineTime),
              new Date().getHours() + ':' + new Date().getMinutes()) < 0
          )
        );
    };
    const getColView = (cols) => {
      const viewColumns = cols.filter(col => col.isView === 'Y');
      return viewColumns.map(column => {
        return {
          headerName: this.generateHeaderName(column),
          hide: column.columnCodeFormat === 'assRFPaymentDate',
          field: this.generateDataOfDefaultField(column.columnCodeFormat, 'fieldSubmit')
            ? this.generateDataOfDefaultField(column.columnCodeFormat, 'field')
            : column.columnCodeFormat,
          fieldSubmit: this.generateDataOfDefaultField(column.columnCodeFormat, 'fieldSubmit'),
          editType: this.generateDataOfDefaultField(column.columnCodeFormat, 'editType'),
          value: this.getValueFromApiOrList(column.columnCodeFormat),
          valueFormatter: params => {
            let val = params.value;
            const columnMatch = EditTypeOfCellVehicleInfo.find(col => (col.field === column.columnCodeFormat));
            if (columnMatch) {
              if (typeof columnMatch.dataFormatType === 'string' && columnMatch.dataFormatType !== 'text') {
                val = this.dataFormatService[columnMatch.dataFormatType](params.value);
              }
              if (Array.isArray(columnMatch.dataFormatType)) {
                val = this.dataFormatService[columnMatch.dataFormatType[0]](
                  params.value,
                  this.getValueFromApiOrList(column.columnCodeFormat) || [],
                  columnMatch.dataFormatType[1]
                );
              }
              if (columnMatch.dataFormatType === 'text') {
                val = (column.columnCodeFormat === 'payVnAmount' || column.columnCodeFormat === 'payUsdAmount')
                  ? this.dataFormatService.formatMoney(params.value)
                  : params.value;
              }
              if (columnMatch.editType === 'datePicker') {
                val = this.dataFormatService.parseDateToDateString(params.value);
              }
            }
            return val ? val : params.value;
          },
          apiCall: this.generateDataOfDefaultField(column.columnCodeFormat, 'apiCall')
            ? this.generateDataOfDefaultField(column.columnCodeFormat, 'apiCall')
            : undefined,
          gridField: this.generateDataOfDefaultField(column.columnCodeFormat, 'gridField'),
          displayField: this.generateDataOfDefaultField(column.columnCodeFormat, 'displayField'),
          canUpdate: editable(column.isUpdate),
          cellClass: params => {
            let cellClass = ['cell-border'];
            if (editableColorDeadline(params)) {
              cellClass = ['cell-readonly', 'cell-border'];
            } else if (editable(column.isUpdate)) {
              cellClass = ['cell-clickable', 'cell-border'];
            }
            return cellClass;
          }
        };
      });
    };
    colView = colView.concat(getColView(orderFirst), getColView(orderAfter));
    return colView;
  }

  private generateHeaderName(column) {
    if (!this.isCbu && column.columnCodeFormat === 'pdiLocId') {
      return 'TSC location';
    } else if (!this.isCbu && column.columnCodeFormat === 'pdiYardAreaName') {
      return 'TSC yard area';
    } else if (!this.isCbu && column.columnCodeFormat === 'mlTruckType') {
      return 'Means';
    } else if (!!this.isCbu && column.columnCodeFormat === 'dlrTruckType') {
      return 'Means';
    } else {
      return column.columnDes ? column.columnDes : column.columnCode;
    }
  }

  private generateDataOfDefaultField(fieldName: string, fieldSelect: string) {
    let val;
    const matchValue = EditTypeOfCellVehicleInfo.find(col => col.field === fieldName || col.fieldSubmit === fieldName);
    if (matchValue) {
      val = matchValue[fieldSelect] ? matchValue[fieldSelect] : undefined;
    }
    return val;
  }

  private getValueFromApiOrList(fieldName) {
    const matchValue = EditTypeOfCellVehicleInfo.find(col => col.field === fieldName || col.fieldSubmit === fieldName);
    return (this.generateDataOfDefaultField(fieldName, 'editType') === 'listOption')
      ? matchValue.defaultValue ? matchValue.defaultValue : []
      : [];
  }

  private generateEditableCol(allField) {
    this.editableColumn = [];
    return allField.map(grCol => {
      const arr = grCol.children.filter(col => !!col && !!col.canUpdate);
      this.editableColumn = this.editableColumn.concat(arr);
    });
  }

  private generateDisplayField(fieldToDisplay) {
    const groupSelected = [];
    for (const key in fieldToDisplay) {
      if (fieldToDisplay[key]) {
        groupSelected.push(key);
      }
    }
    return this.allFieldGrid.filter(groupField => groupSelected.find(groupId => groupId === groupField.groupId.toString()));
  }

  private generateGroupChosenToDisplayField() {
    let groupChosen;
    if (this.isCbu && this.formStoringService.get(StorageKeys.cbuDisplayGroup)) {
      groupChosen = this.formStoringService.get(StorageKeys.cbuDisplayGroup);
    }
    if (!this.isCbu && this.formStoringService.get(StorageKeys.ckdDisplayGroup)) {
      groupChosen = this.formStoringService.get(StorageKeys.ckdDisplayGroup);
    }
    if (groupChosen) {
      groupChosen.pinned = true;
    }
    return groupChosen;
  }

  // cellValueChanged(params) {
  //   console.log(params);
  //   this.editedRows = this.editedRows.filter(it => Number(it.id) !== Number(params.data.id));
  //   this.editedRows.push(params.data);
  // }
  //
  // onSubmitSave() {
  //   const arrayObjList = [];
  //   this.editedRows.forEach((data) => {
  //     arrayObjList.push({
  //       id: Number(data.id),
  //       keyCode: (data.keyCode),
  //       cbuProductionMonth: (data.cbuProductionMonth),
  //     });
  //   });
  //   this.loadingService.setDisplay(true);
  //   this.cbuVehicleInfoService.saveChanges(this.formName, arrayObjList).subscribe(res => {
  //     this.loadingService.setDisplay(false);
  //     this.searchVehicles(this.isCbu ? this.currentCbuFilter : this.currentCkdFilter);
  //     res.message.toLowerCase() === 'success' ? this.swalAlertService.openSuccessModal() : this.swalAlertService.openWarningModal(res.message);
  //     this.editedRows = [];
  //     this.setFilterModel(this.customInfoParams);
  //   });
  // }
}
