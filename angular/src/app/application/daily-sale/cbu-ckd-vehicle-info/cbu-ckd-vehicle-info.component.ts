import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {forkJoin, of} from 'rxjs';
import {concatMap, map, tap} from 'rxjs/operators';
import {flatten, groupBy} from 'lodash';
import * as moment from 'moment';

import {LoadingService} from '../../../shared/loading/loading.service';
import {CbuVehicleInfoService} from '../../../api/daily-sale/cbu-vehicle-info.service';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {GradeListService} from '../../../api/master-data/grade-list.service';
import {TransportTypeService} from '../../../api/master-data/transport-type.service';
import {GradeListModel} from '../../../core/models/sales/model-list.model';
import {UserColumnService} from '../../../api/admin/user-column.service';
import {PaginationParamsModel} from '../../../core/models/base.model';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {SpecialFields} from '../../../core/constains/cbu-lexus-ckd-field';
import {TMSSTabs} from '../../../core/constains/tabs';
import {FilterFormCode} from '../../../core/constains/filter-form-code';
import {AudioManagementService} from '../../../api/master-data/audio-management.service';
import {InsuranceCompanyService} from '../../../api/master-data/insurance-company.service';
import {TruckService} from '../../../api/master-data/truck.service';
import {LogisticsCompanyService} from '../../../api/master-data/logistics-company.service';
import {YardLocationService} from '../../../api/master-data/yard-location.service';
import {YardAreaService} from '../../../api/master-data/yard-area.service';
import {ColorListService} from '../../../api/master-data/color-list.service';
import {ColorAssignmentService} from '../../../api/master-data/color-assignment.service';
import {InteriorAssignmentService} from '../../../api/master-data/interior-assignment.service';
import {DealerAddressDeliveryService} from '../../../api/master-data/dealer-address-delivery.service';
import {FleetCustomerService} from '../../../api/fleet-sale/fleet-customer.service';
import {GridExportService} from '../../../shared/common-service/grid-export.service';
import {ImportTemplate, ImportType} from '../../../core/constains/import-types';
// @ts-ignore
import {ImportService} from '../../../api/import/import.service';
import {ToastService} from '../../../shared/common-service/toast.service';
import {AgDateEditorComponent} from '../../../shared/ag-grid-table/ag-datepicker-editor/ag-date-editor.component';
import {AgMonthEditorComponent} from '../../../shared/ag-grid-table/ag-monthpicker-editor/ag-month-editor.component';
import {AgTimeEditorComponent} from '../../../shared/ag-grid-table/ag-timepicker-editor/ag-time-editor.component';

interface BottomInfo {
  nonAssignment: number;
  rfPayment: number;
  total: number;
}

const agDateEditorComponent = 'agDateEditorComponent';
const agMonthEditorComponent = 'agMonthEditorComponent';
const agTimeEditorComponent = 'agTimeEditorComponent';
const mimeTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
const dateFormat = 'DD-MMM-YYYY';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cbu-ckd-vehicle-info',
  templateUrl: './cbu-ckd-vehicle-info.component.html',
  styleUrls: ['./cbu-ckd-vehicle-info.component.scss']
})
export class CbuCkdVehicleInfoComponent implements OnInit {
  @ViewChild('fileInput', {static: false}) fileInput;
  @Input() isCbu: boolean;
  @Input() selectedTab;
  @Input() filterStartFormCbu;
  @Input() filterStartFormCkd;
  @Input() currentFilterFormType: string;

  searchForm: FormGroup;
  importForm: FormGroup;
  cbuOrCkd: string; // CBU or CKD
  pageTitle: string;
  filterDataList = [];
  fullCbuVehicleFields; // For Ag-grid
  fullCkdVehicleFields; // For Ag-grid
  fieldGridCustomInfo; // For Ag-grid
  allFieldGrid; // For Ag-grid
  frameworkComponents; // For Ag-grid
  customInfoParamsCbu; // For Ag-grid
  customInfoParamsCkd; // For Ag-grid
  selectedData; // For Ag-grid
  columnGroups; // Store cloumn groups get from api
  selectedGroupIds; // Store cloumn group Ids get from api
  globalFilter; // For Searching
  searchParams; // For Searching
  filterFormCode = FilterFormCode; // For Searching
  paginationParams: PaginationParamsModel; // For Pagination
  paginationTotalsData: number; // For Pagination
  bottomInfo: BottomInfo; // For Pagination
  importType = ImportType; // For uploading
  selectedImportType; // For uploading
  importTemplate = ImportTemplate; // For importing
  vehicles = [];
  dealers = [];
  grades: Array<GradeListModel> = [];
  insuranceCompanies = [];
  logisticCompanies = [];
  transportTypes = [];
  audios = [];
  areas = [];
  deliveryAddresses = [];
  VPYardRegions = [];
  yardLocations = [];
  VPYardLocations = [];
  trucks = [];
  fleetCustomers = [];
  allColors = [];
  cbuCkdColors;
  cbuCkdIntColors;
  yardNotNoParkingLocations = [];
  exportParams;

  CanEditCondition = {
    tmssNo: [{
      condition: (matchData, paramData) => matchData.field === 'tmssNo',
      failText: 'Giá trị TMSS No được bảo vệ, không được cập nhật'
    }],
    dealerRequestColorId: [{
      condition: (matchData, paramData) => matchData.field === 'dealerRequestColorId' && (paramData.dealer && paramData.dealerId !== -1),
      failText: 'Chỉ được đổi màu cho xe của TMV'
    }, {
      condition: (matchData, paramData) => matchData.field === 'dealerRequestColorId' && paramData.lineOffDate,
      failText: 'Xe đã xuất xưởng'
    }, {
      condition: (matchData, paramData) => matchData.field === 'dealerRequestColorId' && !paramData.lineOffDate
        && (!paramData.dealerColorDeadline || !paramData.dealerColorDeadlineTime),
      failText: 'Chưa có thông tin Color Deadline, Color Deadline Time'
    }, {
      condition: (matchData, paramData) => matchData.field === 'dealerRequestColorId' && this.isOverDeadline(paramData),
      failText: 'Đã quá hạn để cập nhật'
    }],
    extColor: [{
      condition: (matchData, paramData) => matchData.field === 'extColor' && paramData.lineOffDate,
      failText: 'Xe đã xuất xưởng'
    }],
    intColor: [{
      condition: (matchData, paramData) => matchData.field === 'intColor' && paramData.lineOffDate,
      failText: 'Xe đã xuất xưởng'
    }],
    dlrPaymentPlan: [{
      condition: (matchData, paramData) => matchData.field === 'dlrPaymentPlan' && (paramData.payActualInvoiceDate || paramData.payInvoiceNo),
      failText: 'Xe đã có thông tin xuất hóa đơn'
    }],
    payInvoiceNo: [{
      condition: (matchData, paramData) => matchData.field === 'payInvoiceNo' && (paramData.payActualInvoiceDate && paramData.payInvoiceNo),
      failText: 'Xe đã có thông tin xuất hóa đơn'
    }],
    payActualInvoiceDate: [{
      condition: (matchData, paramData) => matchData.field === 'payActualInvoiceDate' && (paramData.payActualInvoiceDate && paramData.payInvoiceNo),
      failText: 'Xe đã có thông tin xuất hóa đơn'
    }],
    dealerId: [{
      condition: (matchData, paramData) => matchData.field === 'dealerId' && (paramData.payActualInvoiceDate || paramData.payInvoiceNo),
      failText: 'Xe đã có thông tin xuất hóa đơn'
    }],
    assDealerChangeFromName: [{
      condition: (matchData, paramData) => matchData.field === 'assDealerChangeFromName' && (paramData.payActualInvoiceDate || paramData.payInvoiceNo),
      failText: 'Xe đã có thông tin xuất hóa đơn'
    }],
    assDealerChangeFrom: [{
      condition: (matchData, paramData) => matchData.field === 'assDealerChangeFrom' && (paramData.payActualInvoiceDate || paramData.payInvoiceNo),
      failText: 'Xe đã có thông tin xuất hóa đơn'
    }],
    mlOtherDlr: [{
      condition: (matchData, paramData) => matchData.field === 'mlOtherDlr' && (paramData.payActualInvoiceDate || paramData.payInvoiceNo),
      failText: 'Xe đã có thông tin xuất hóa đơn'
    }],
    invoiceRequestDate: [{
      condition: (matchData, paramData) => matchData.field === 'invoiceRequestDate' && paramData.payInvoiceNo,
      failText: `Xe đã xuất hóa đơn`
    }, {
      condition: (matchData, paramData) => matchData.field === 'invoiceRequestDate' && !paramData.payInvoiceNo && !paramData.lineOffDate && !this.isCbu,
      failText: `Phải chọn Line Off Date`
    }, {
      condition: (matchData, paramData) => matchData.field === 'invoiceRequestDate' && !paramData.payInvoiceNo && !paramData.cbuDocDelivery && this.isCbu,
      failText: `Phải chọn Doc Delivery`
    }, {
      condition: (matchData, paramData) => matchData.field === 'invoiceRequestDate' && !paramData.assAlloMonth,
      failText: `Chưa có thông tin Allocation month`
    }],
    originDocPlan: [{
      condition: (matchData, paramData) => matchData.field === 'originDocPlan' && !!paramData.originDocPlan,
      failText: `Không được phép cập nhật`
    }],
    dlrDeliveryAtId: [{
      condition: (matchData, paramData) => this.isAfterTime(paramData.dlrDispatchPlan, this.isCbu, matchData.field === 'dlrDeliveryAtId'),
      failText: `Đã quá hạn để cập nhật`
    }, {
      condition: (matchData, paramData) => this.isAfterTime(paramData.mlPlanDeliveryDate, this.isCbu, matchData.field === 'dlrDeliveryAtId'),
      failText: `Đã quá hạn để cập nhật`
    }]
  };

  isAfterTime(date: string | null, isCbu: boolean, isConsideringField: boolean): boolean {
    if (!date) {
      return false;
    }
    const hour = moment(`${date} 12:00`, `${dateFormat} HH:mm`).subtract(2, 'day');
    return isConsideringField && !isCbu && moment().isAfter(hour);
  }

  isOverDeadline(paramData) {
    const isAfterDeadlineDay = !!paramData.dealerColorDeadline && moment(paramData.dealerColorDeadline, dateFormat).isAfter(moment());
    const isAfterDeadlineTime = !!paramData.dealerColorDeadlineTime && moment(paramData.dealerColorDeadlineTime, 'HH:mm').isAfter(moment());
    return isAfterDeadlineDay || isAfterDeadlineTime;
  }

  constructor(private formBuilder: FormBuilder, private loadingService: LoadingService, private cbuVehicleInfoService: CbuVehicleInfoService,
              private dealerListService: DealerListService, private gradeListService: GradeListService, private transportTypeService: TransportTypeService,
              private audioManagementService: AudioManagementService, private insuranceCompanyService: InsuranceCompanyService,
              private truckService: TruckService, private logisticsCompanyService: LogisticsCompanyService, private yardLocationService: YardLocationService,
              private yardAreaService: YardAreaService, private colorListService: ColorListService, private colorAssignmentService: ColorAssignmentService,
              private interiorAssignmentService: InteriorAssignmentService, private dealerAddressDeliveryService: DealerAddressDeliveryService,
              private fleetCustomerService: FleetCustomerService, private userColumnService: UserColumnService, private dataFormatService: DataFormatService,
              private formStoringService: FormStoringService, private gridExportService: GridExportService, private importService: ImportService,
              private toastService: ToastService) {
    this.frameworkComponents = {
      [`${agDateEditorComponent}`]: AgDateEditorComponent,
      [`${agMonthEditorComponent}`]: AgMonthEditorComponent,
      [`${agTimeEditorComponent}`]: AgTimeEditorComponent
    };
    const cbuCkdColors$ = this.getColorsForCbuCkd();
    const cbuCkdIntColors$ = this.getIntColorsForCbuCkd();
    forkJoin({cbuCkdColors$, cbuCkdIntColors$})
      .subscribe(response => {
        this.cbuCkdColors = response.cbuCkdColors$;
        this.cbuCkdIntColors = response.cbuCkdIntColors$;
      });
  }

  ngOnInit() {
    this.declareTableFields();
    this.searchForm = this.formBuilder.group({dealerId: [null], gradeId: [null], keyword: [null]});
    this.importForm = this.formBuilder.group({files: [undefined]});

    this.cbuOrCkd = this.isCbu ? 'cbu' : 'ckd';
    if (this.isCbu) {
      this.globalFilter = this.filterStartFormCbu = this.formStoringService.get(StorageKeys.cbuFilterStartModal);
    } else {
      this.globalFilter = this.filterStartFormCkd = this.formStoringService.get(StorageKeys.ckdFilterStartModal);
    }
    this.allFieldGrid = this.fieldGridCustomInfo = this.isCbu ? this.fullCbuVehicleFields : this.fullCkdVehicleFields;

    const dealers$ = this.dealerListService.getAvailableDealers();
    const grades$ = this.gradeListService.getGradesByForm(this.cbuOrCkd);
    const transportTypes$ = this.transportTypeService.getAllTransportType();

    this.resetPaginationParams();
    forkJoin({dealers$, grades$, transportTypes$})
      .pipe(
        tap(response => {
          this.dealers = response.dealers$;
          this.grades = response.grades$;
          this.transportTypes = response.transportTypes$;
        }),
        concatMap(_ => this.handleGroupColumnsRequest(this.cbuOrCkd)),
        map(groupColumns => this.handleGroupColumnsResponse(groupColumns.groups)),
        concatMap(callingFieldApis => this.handleApisRequest(callingFieldApis))
      )
      .subscribe((apisData: any) => this.handleApisResponse(apisData));
  }

  declareTableFields() {
    this.fullCbuVehicleFields = [
      {
        groupId: 'pinned',
        field: 'vehicleInformationGroup',
        children: [
          {
            headerName: 'Type',
            field: 'cbuCkd',
            resizable: true,
            pinned: true,
            cellRenderer: params => this.getTypeCbuCkd(params.data.cbuCkd)
          },
          {headerName: 'Status', field: 'vehicleStatusName', resizable: true, pinned: true},
          {field: 'gradePro', resizable: true, pinned: true},
          {field: 'grade', resizable: true, pinned: true},
          {headerName: 'VIN', field: 'vin', resizable: true, pinned: true},
          {field: 'frameNo', resizable: true, pinned: true, cellClass: ['cell-border', 'text-right']},
          {field: 'engineNo', resizable: true, pinned: true},
          {
            headerName: 'Key Code',
            field: 'keyCode',
            resizable: true,
            pinned: true,
            editable: true,
            cellClass: ['cell-clickable', 'cell-border']
          },
          {
            headerName: 'IColor',
            field: 'intColor',
            resizable: true,
            pinned: true,
            editable: true,
            cellClass: ['cell-clickable', 'cell-border'],
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: params => ({values: this.extractValues(groupBy(this.cbuCkdIntColors, 'gradeProductId')[params.data.graProId], 'code')}),
            valueFormatter: params => params ? this.lookupValue(this.cbuCkdIntColors, 'code', 'code', params.value) : '',
            valueParser: params => params ? this.lookupKey(this.cbuCkdIntColors, 'code', 'code', params.newValue) : ''
          },
          {
            headerName: 'EColor',
            field: 'extColor',
            resizable: true,
            pinned: true,
            editable: true,
            cellClass: ['cell-clickable', 'cell-border'],
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: params => ({values: this.extractValues(groupBy(this.cbuCkdColors, 'gradeProductId')[params.data.graProId], 'code')}),
            valueFormatter: params => params ? this.lookupValue(this.cbuCkdColors, 'code', 'code', params.value) : '',
            valueParser: params => params ? this.lookupKey(this.cbuCkdColors, 'code', 'code', params.newValue) : ''
          },
          {
            headerName: 'Line Off Month',
            field: 'cbuProductionMonth',
            resizable: true,
            pinned: true,
            editable: true,
            cellClass: ['cell-clickable', 'cell-border'],
            cellEditor: `${agMonthEditorComponent}`,
            valueFormatter: params => this.dataFormatService.parseDateToMonthString(params.value)
          }
        ]
      }
    ];
    this.fullCkdVehicleFields = [
      {
        groupId: 'pinned',
        field: 'vehicleInformationGroup',
        children: [
          {
            headerName: 'Type',
            field: 'cbuCkd',
            resizable: true,
            pinned: true,
            cellRenderer: params => this.getTypeCbuCkd(params.data.cbuCkd)
          },
          {field: 'gradePro', resizable: true, pinned: true},
          {field: 'grade', resizable: true, pinned: true},
          {field: 'frameNo', resizable: true, pinned: true},
          {headerName: 'VIN', field: 'vin', resizable: true, pinned: true},
          {field: 'engineNo', resizable: true, pinned: true},
          {headerName: 'Eng Code', field: 'engCode', resizable: true, pinned: true},
          {
            headerName: 'Color',
            field: 'extColor',
            editable: true,
            resizable: true,
            pinned: true,
            cellClass: ['cell-clickable', 'cell-border'],
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: params => ({values: this.extractValues(groupBy(this.cbuCkdColors, 'gradeProductId')[params.data.graProId], 'code')}),
            // valueFormatter: params => params ? this.lookupValue(this.cbuCkdColors, 'code', 'code', params.value) : '',
            valueParser: params => params ? this.lookupKey(this.cbuCkdColors, 'code', 'code', params.newValue) : ''
          }
        ]
      }
    ];
  }

  searchVehicles() {
    of(this.handleGroupColumnsResponse(this.columnGroups))
      .pipe(
        concatMap(callingFieldApis => this.handleApisRequest(callingFieldApis))
      )
      .subscribe((apisData: any) => this.handleApisResponse(apisData));
  }

  handleApisRequest(callingFieldApis: object) {
    const vehicles$ = this.handleSearchVehiclesRequest();
    return forkJoin(Object.assign({}, {vehicles$}, callingFieldApis));
  }

  handleApisResponse(apisData: any) {
    const groups = this.columnGroups.map(group => ({
      groupId: group.groupId,
      field: group.groupCode,
      children: this.generateGridFields(group.columns)
    }));
    this.allFieldGrid = this.isCbu ? [...this.fullCbuVehicleFields, ...groups] : [...this.fullCkdVehicleFields, ...groups];
    this.fieldGridCustomInfo = this.allFieldGrid.filter(groupField => this.selectedGroupIds.find(groupId => groupId === groupField.groupId.toString()));
    this.insuranceCompanies = apisData.hasOwnProperty('getInsuranceCompanies$') ? apisData.getInsuranceCompanies$ : [];
    this.logisticCompanies = apisData.hasOwnProperty('getLogisticCompanyAvailable$') ? apisData.getLogisticCompanyAvailable$ : [];
    this.transportTypes = apisData.hasOwnProperty('getTransportTypeAvailable$') ? apisData.getTransportTypeAvailable$ : [];
    this.audios = apisData.hasOwnProperty('getAudiosAvailable$') ? apisData.getAudiosAvailable$ : [];
    this.areas = apisData.hasOwnProperty('getYardNo$') ? apisData.getYardNo$ : [];
    this.deliveryAddresses = apisData.hasOwnProperty('getAllDlrDeliveryAtAddress$') ? apisData.getAllDlrDeliveryAtAddress$ : [];
    this.VPYardRegions = apisData.hasOwnProperty('getYardRegionVP$')
      ? apisData.getYardRegionVP$.map(yardRegion => {
        yardRegion.name = yardRegion.name.replace(new RegExp(`^${yardRegion.yardCode}\\/`), '');
        return yardRegion;
      }) : [];
    this.yardLocations = apisData.hasOwnProperty('getYardLocationAvailable$')
      ? apisData.getYardLocationAvailable$.map(location => {
        location.text = `${location.yardCode} - ${location.code} - ${location.area}`;
        return location;
      }) : [];
    this.VPYardLocations = apisData.hasOwnProperty('getYardLocationVP$') ? apisData.getYardLocationVP$ : [];
    this.trucks = apisData.hasOwnProperty('getTrucksAvailable$') ? apisData.getTrucksAvailable$ : [];
    this.fleetCustomers = apisData.hasOwnProperty('getFleetCustomer$') ? apisData.getFleetCustomer$ : [];
    this.allColors = apisData.hasOwnProperty('getColorsAvailable$') ? apisData.getColorsAvailable$ : [];
    this.yardNotNoParkingLocations = apisData.hasOwnProperty('getYardLocationParkingNotNo$') ? apisData.getYardLocationParkingNotNo$ : [];

    this.handleSearchVehiclesResponse(apisData.vehicles$);
  }

  handleGroupColumnsRequest(cbuOrCkd) {
    this.loadingService.setDisplay(true);
    return this.userColumnService.getColumnsAuthorize(cbuOrCkd);
  }

  /*
   * Xử lý các Group của các Column đã được chọn tại modal chọn nhóm cột để hiển thị (click vào button Display)
   * Hàm chọn ra các group không phải là 'VEHICLES', sau đó tìm kiếm các column có chứa các lời gọi đến API
   * Các API được định nghĩa tại biến SpecialFields
   * Hàm trả về là đối tượng chứa các lời gọi API
   */
  handleGroupColumnsResponse(groupColumns) {
    const chosenGroups = (this.isCbu && this.formStoringService.get(StorageKeys.cbuDisplayGroup))
      ? this.formStoringService.get(StorageKeys.cbuDisplayGroup)
      : (!this.isCbu && this.formStoringService.get(StorageKeys.ckdDisplayGroup)) ? this.formStoringService.get(StorageKeys.ckdDisplayGroup) : {pinned: true};
    if (!Array.isArray(groupColumns)) {
      this.toastService.openFailModal('Không thể lấy dữ liệu các cột từ server.');
      this.loadingService.setDisplay(false);
      return {};
    }
    this.columnGroups = groupColumns.filter(group => group.groupCode !== 'VEHICLES');
    this.selectedGroupIds = Object.entries(chosenGroups).filter(entry => !!entry[1]).map(entry => entry[0]);
    const selectedGroups = this.selectedGroupIds.filter(id => id !== 'pinned').map(id => groupColumns.find(group => group.groupId === Number(id)));
    const selectedGroupColumns: any[] = flatten(selectedGroups.map(selectedGroup => selectedGroup.columns));
    const fields = SpecialFields.filter(item => selectedGroupColumns.some(column => column.columnCodeFormat === item.field));
    const apiCalls = fields.filter(item => !!item.apiCall).map(item => item.apiCall);
    // remove duplicate elements
    const uniqueApiCalls = Array.from(new Set(apiCalls));
    return Object.assign({}, ...uniqueApiCalls.map(api => ({[`${api}$`]: this[api]()})));
  }

  handleSearchVehiclesRequest() {
    this.searchParams = !!this.searchForm ? this.searchForm.getRawValue() : {
      dealerId: null,
      keyword: null,
      gradeId: null
    };
    this.loadingService.setDisplay(true);
    return this.cbuVehicleInfoService.search(this.cbuOrCkd, this.globalFilter, this.searchParams, this.filterDataList, this.paginationParams);
  }

  handleSearchVehiclesResponse(searchingResults) {
    this.loadingService.setDisplay(false);
    this.bottomInfo = searchingResults.bottomInfo;
    this.paginationTotalsData = searchingResults.bottomInfo ? searchingResults.bottomInfo.total : 0;
    this.vehicles = searchingResults.vehicles.map(data => data.vehicle);
    this.selectedTab === TMSSTabs.cbuVehicleInfo ? this.fillDataToGrid(this.customInfoParamsCbu, this.vehicles) : this.fillDataToGrid(this.customInfoParamsCkd, this.vehicles);
  }

  searchWithSaleFilter(filterDataList) {
    this.resetPaginationParams();
    this.filterDataList = filterDataList;
    this.searchVehicles();
  }

  getExportParams(params) {
    this.exportParams = params;
  }

  onBtnExport() {
    this.loadingService.setDisplay(true);
    this.cbuVehicleInfoService.search(this.cbuOrCkd, this.globalFilter, this.searchParams, this.filterDataList, {filters: []})
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

  importExcel(type) {
    this.selectedImportType = type;
    this.fileInput.nativeElement.click();
  }

  onChangeFile(event?) {
    const uploadingFile: File = this.fileInput.nativeElement.files.item(0);
    const formData: FormData = new FormData();
    formData.append('file', uploadingFile, uploadingFile.name.trim());

    if (!mimeTypes.some(mimeType => mimeType === uploadingFile.type)) {
      this.toastService.openWarningModal('Template file invalid. Please choose Excel file again');
      this.importForm.reset();
      return;
    }

    let importingUrl = '';
    switch (this.selectedImportType) {
      case ImportType.customerInfo:
        importingUrl = 'import/cbu_customer_info';
        break;
      case ImportType.deliveryRouteDLR:
        importingUrl = 'import/cbu_delivery_route_dlr';
        break;
      case ImportType.fixPaymentDeadline:
        importingUrl = 'import/fix_payment_deadline';
        break;
    }

    this.loadingService.setDisplay(true);
    this.importService.importCbuCkdExcel(importingUrl, formData)
      .subscribe(
        successMessage => {
          this.loadingService.setDisplay(false);
          this.toastService.openSuccessModal(successMessage, 'Import Success');
          this.resetPaginationParams();
          this.searchVehicles();
          this.importForm.reset();
        },
        (errors: HttpErrorResponse) => {
          this.loadingService.setDisplay(false);
          let notifiedMessage = '';
          if (errors.status === 400) {
            (errors.error as Array<string>).forEach(text => notifiedMessage += `<div>${text}</div>`);
            this.toastService.openFailModal(notifiedMessage, 'Import Error');
          }
          this.importForm.reset();
        }
      );
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  fillDataToGrid(params, vehicles) {
    params.api.setRowData(vehicles);
    this.setFilterModel(!!this.isCbu ? this.customInfoParamsCbu : this.customInfoParamsCkd);
    setTimeout(() => {
      const allColumnIds = params.columnApi.getAllDisplayedColumns().map(column => column.colId);
      params.columnApi.autoSizeColumns(allColumnIds);
    }, 200);
  }

  setFilterModel(params) {
    if (this.paginationParams && this.paginationParams.filters.length) {
      const obj = {};
      this.paginationParams.filters.map(item => obj[item.fieldFilter] = {
        type: 'contains',
        filterType: 'text',
        filter: item.filterValue
      });
      params.api.setFilterModel(obj);
    }
  }

  private generateGridFields(columns) {
    return [...columns.filter(col => !!col.order), ...columns.filter(col => !col.order)].map(column => ({
      headerName: this.generateHeaderName(column),
      hide: column.isView !== 'Y' || column.columnCodeFormat === 'assRFPaymentDate',
      editable: params => this.isEditable(params, column),
      field: column.columnCodeFormat,
      cellClass: params => {
        if (column.columnCodeFormat === 'tmssNo') {
          return ['cell-border'];
        }
        // tslint:disable-next-line:max-line-length
        if ((params.colDef.field === 'dealerColorDeadline' || params.colDef.field === 'dealerColorDeadlineTime' || params.colDef.field === 'dealerRequestColorId' || params.colDef.field === 'pioMember')
          && !this.isOverDeadline(params.data)) {
          return ['cell-readonly', 'cell-border'];
        }
        if (this.isEditable(params, column)) {
          return ['cell-clickable', 'cell-border'];
        }
      },
      validators: this.setCellValidators(column),
      cellEditor: this.getCellEditor(column),
      cellEditorParams: params => {
        const found = SpecialFields.find(item => item.field === params.colDef.field);
        if (!!found && found.editType === 'listOption') {
          return found.dataFormatType === 'text' ? {values: found.defaultValue} : {values: this.extractValues(found.defaultValue, 'id')};
        }
        switch (params.colDef.field) {
          case 'dealerId':
          case 'assChangeFrom':
          case 'mlOtherDlr':
            return {values: ['', ...this.extractValues(this.dealers, 'id')]};
          case 'audio':
            return {values: ['', ...this.extractValues(this.audios, found.displayField)]};
          case 'pdiYardArea':
            return {values: ['', ...this.extractValues(this.areas, 'id')]};
          case 'dlrDeliveryAtId':
            if (!!params.data.mlOtherDlr) {
              return {values: ['', ...this.extractValues(groupBy(this.deliveryAddresses, 'dealerId')[params.data.dealerId], 'id')]};
            }
            if (!!params.data.dealerId) {
              return {values: ['', ...this.extractValues(groupBy(this.deliveryAddresses, 'dealerId')[params.data.dealerId], 'id')]};
            }
            return {values: this.extractValues(this.deliveryAddresses, 'id')};
          case 'damageInsCompany':
            return {values: ['', ...this.extractValues(this.insuranceCompanies, found.displayField)]};
          case 'interLog':
          case 'swapLog':
          case 'hpLogisticCompany':
          case 'pdiLogistic':
          case 'mlLogisticCompanyId':
          case 'dlrLogId':
          case 'pdiLogisticCompany':
          case 'mlLogistic':
            return {values: ['', ...this.extractValues(this.logisticCompanies, 'id')]};
          case 'interMeanTrans':
          case 'swapTructType':
          case 'dlrTruckType':
          case 'hpTruckType':
          case 'mlTruckType':
          case 'pdiTructType':
          case 'clTruckType':
          case 'spctTruckType':
          case 'pdiTruckType':
            return {values: ['', ...this.extractValues(this.transportTypes, found.displayField)]};
          case 'mlYardArea':
            return {values: ['', ...this.extractValues(this.VPYardRegions, found.displayField)]};
          case 'mlYardLoc':
          case 'yardLoc':
            return {values: ['', ...this.extractValues(this.yardLocations, found.displayField)]};
          case 'loc':
            return {values: ['', ...this.extractValues(this.VPYardLocations, found.displayField)]};
          case 'interTruct':
          case 'swapTruct':
          case 'dlrTruck':
          case 'mlTruck':
            return {values: ['', ...this.extractValues(this.trucks, found.displayField)]};
          case 'fleetCustomer':
            return {values: ['', ...this.extractValues(this.fleetCustomers, found.displayField)]};
          case 'dlrColRq':
            return {values: ['', ...this.extractValues(this.allColors, found.displayField)]};
          case 'dealerRequestColorId':
            return {values: ['', ...this.extractValues(groupBy(this.cbuCkdColors, 'gradeProductId')[params.data.graProId], 'id')]};
          case 'intColor':
            return {values: ['', ...this.extractValues(groupBy(this.cbuCkdIntColors, 'gradeProductId')[params.data.graProId], found.displayField)]};
          case 'pdiLocId':
            return {values: ['', ...this.extractValues(groupBy(this.yardNotNoParkingLocations, 'pdiYardArea')[params.data.pdiYardArea], 'id')]};
          // return {values: ['', ...this.extractValues(this.yardNotNoParkingLocations, 'id')]};
        }
      },
      valueFormatter: params => {
        // convert code to value
        const found = SpecialFields.find(item => item.field === params.colDef.field);
        if (!!found && found.editType === 'number') {
          return this.dataFormatService.numberFormat(params.value);
        }
        if (!!found && found.editType === 'datePicker') {
          return this.dataFormatService.parseDateToDateString(params.value);
        }
        if (!!found && found.editType === 'monthPicker') {
          return this.dataFormatService.parseDateToMonthString(params.value);
        }
        if (!!found && found.editType === 'timePicker') {
          return this.dataFormatService.formatHoursSecond(params.value);
        }
        if (!!found && found.editType === 'listOption') {
          return found.dataFormatType === 'text' ? params.value : this.lookupValue(found.defaultValue, 'id', 'value', params.value);
        }
        switch (params.colDef.field) {
          case 'dealerId':
          case 'assChangeFrom':
          case 'mlOtherDlr':
            return this.lookupValue(this.dealers, 'id', found.displayField, params.value);
          case 'audio':
            return this.lookupValue(this.audios, found.displayField, found.displayField, params.value);
          case 'pdiYardArea':
            return this.lookupValue(this.areas, 'id', found.displayField, params.value);
          case 'dlrDeliveryAtId':
            return this.lookupValue(this.deliveryAddresses, 'id', found.displayField, params.value);
          case 'damageInsCompany':
            return this.lookupValue(this.insuranceCompanies, found.displayField, found.displayField, params.value);
          case 'interLog':
          case 'swapLog':
          case 'hpLogisticCompany':
          case 'pdiLogistic':
          case 'mlLogisticCompanyId':
          case 'dlrLogId':
          case 'pdiLogisticCompany':
          case 'mlLogistic':
            return this.lookupValue(this.logisticCompanies, 'id', found.displayField, params.value);
          case 'interMeanTrans':
          case 'swapTructType':
          case 'dlrTruckType':
          case 'hpTruckType':
          case 'mlTruckType':
          case 'pdiTructType':
          case 'clTruckType':
          case 'spctTruckType':
          case 'pdiTruckType':
            return this.lookupValue(this.transportTypes, found.displayField, found.displayField, params.value);
          case 'mlYardArea':
            return this.lookupValue(this.VPYardRegions, found.displayField, found.displayField, params.value);
          case 'mlYardLoc':
          case 'yardLoc':
            return this.lookupValue(this.yardLocations, found.displayField, found.displayField, params.value);
          case 'loc':
            return this.lookupValue(this.VPYardLocations, found.displayField, found.displayField, params.value);
          case 'interTruct':
          case 'swapTruct':
          case 'dlrTruck':
          case 'mlTruck':
            return this.lookupValue(this.trucks, found.displayField, found.displayField, params.value);
          case 'fleetCustomer':
            return this.lookupValue(this.fleetCustomers, found.displayField, found.displayField, params.value);
          case 'dlrColRq':
            return this.lookupValue(this.allColors, found.displayField, found.displayField, params.value);
          case 'dealerRequestColorId':
            return this.lookupValue(this.cbuCkdColors, 'id', found.displayField, params.value);
          case 'intColor':
            return this.lookupValue(this.cbuCkdIntColors, found.displayField, found.displayField, params.value);
          case 'pdiLocId':
            return this.lookupValue(this.yardNotNoParkingLocations, 'id', found.displayField, params.value);
          default:
            return params.value;
        }
      },
      valueParser: params => {
        // convert value to code
        const found = SpecialFields.find(item => item.field === params.colDef.field);
        if (!!found && found.editType === 'timePicker') {
          return this.dataFormatService.formatHoursSecond(params.value);
        }
        if (!!found && found.editType === 'listOption') {
          return found.dataFormatType === 'text' ? params.newValue : this.lookupKey(found.defaultValue, 'id', 'value', params.newValue);
        }
        switch (params.colDef.field) {
          case 'dealerId':
          case 'assChangeFrom':
          case 'mlOtherDlr':
            return this.lookupKey(this.dealers, 'id', found.displayField, params.newValue);
          case 'audio':
            return this.lookupKey(this.audios, found.displayField, found.displayField, params.newValue);
          case 'pdiYardArea':
            return this.lookupKey(this.areas, 'id', found.displayField, params.newValue);
          case 'dlrDeliveryAtId':
            return this.lookupKey(this.deliveryAddresses, 'id', found.displayField, params.newValue);
          case 'damageInsCompany':
            return this.lookupKey(this.insuranceCompanies, found.displayField, found.displayField, params.newValue);
          case 'interLog':
          case 'swapLog':
          case 'hpLogisticCompany':
          case 'pdiLogistic':
          case 'mlLogisticCompanyId':
          case 'dlrLogId':
          case 'pdiLogisticCompany':
          case 'mlLogistic':
            return this.lookupKey(this.logisticCompanies, 'id', found.displayField, params.newValue);
          case 'interMeanTrans':
          case 'swapTructType':
          case 'dlrTruckType':
          case 'hpTruckType':
          case 'mlTruckType':
          case 'pdiTructType':
          case 'clTruckType':
          case 'spctTruckType':
          case 'pdiTruckType':
            return this.lookupKey(this.transportTypes, found.displayField, found.displayField, params.newValue);
          case 'mlYardArea':
            return this.lookupKey(this.VPYardRegions, found.displayField, found.displayField, params.newValue);
          case 'mlYardLoc':
          case 'yardLoc':
            return this.lookupKey(this.yardLocations, found.displayField, found.displayField, params.newValue);
          case 'loc':
            return this.lookupKey(this.VPYardLocations, found.displayField, found.displayField, params.newValue);
          case 'interTruct':
          case 'swapTruct':
          case 'dlrTruck':
          case 'mlTruck':
            return this.lookupKey(this.trucks, found.displayField, found.displayField, params.newValue);
          case 'fleetCustomer':
            return this.lookupKey(this.fleetCustomers, found.displayField, found.displayField, params.newValue);
          case 'dlrColRq':
            return this.lookupKey(this.allColors, found.displayField, found.displayField, params.newValue);
          case 'dealerRequestColorId':
            return this.lookupKey(this.cbuCkdColors, 'id', found.displayField, params.newValue);
          case 'intColor':
            return this.lookupKey(this.cbuCkdIntColors, found.displayField, found.displayField, params.newValue);
          case 'pdiLocId':
            return this.lookupKey(this.yardNotNoParkingLocations, 'id', found.displayField, params.newValue);
          default:
            return params.newValue;
        }
      },
      filter: this.getColumnFilter(column)
    }));
  }

  isEditable(params, column) {
    const found = SpecialFields.find(item => params.colDef.field === item.field);
    if (column.isUpdate === 'Y' && !!found && !!this.CanEditCondition[found.field]) {
      for (const checkCondition of this.CanEditCondition[found.field]) {
        if (checkCondition.condition(found, params.data)) {
          return false;
        }
      }
    }
    if (column.isUpdate === 'Y' && params.colDef.field !== 'tmssNo') {
      return true;
    }
  }

  extractValues(mappings: Array<any>, key: string): Array<any> {
    return !!mappings ? mappings.map(mapping => mapping[key]) : [];
  }

  lookupValue(mappings, key: string, lookup: string, value) {
    if (!mappings) {
      return;
    }
    const found = mappings.find(mapping => mapping[key] === value);
    return !!found ? found[lookup] : '';
  }

  lookupKey(mappings: Array<any>, key: string, lookup: string, value) {
    const found = mappings.find(mapping => mapping[lookup] === value);
    return !!found ? found[key] : '';
  }

  getCellEditor(column) {
    const found = SpecialFields.find(item => item.field === column.columnCodeFormat);
    if (!!found && (found.editType === 'select' || found.editType === 'list' || found.editType === 'listOption')) {
      return 'agRichSelectCellEditor';
    }
    if (!!found && (found.editType === 'datePicker')) {
      return `${agDateEditorComponent}`;
    }
    if (!!found && (found.editType === 'monthPicker')) {
      return `${agMonthEditorComponent}`;
    }
    if (!!found && (found.editType === 'timePicker')) {
      return `${agTimeEditorComponent}`;
    }
  }

  // validators: this.setCellValidators(column),
  setCellValidators(column): Array<string> {
    const editType = this.generateDataOfDefaultField(column.columnCodeFormat, 'editType');
    if (editType === 'number') {
      return [editType];
    }
  }

  getColumnFilter(column): string {
    const editType = this.generateDataOfDefaultField(column.columnCodeFormat, 'editType');
    if (editType === 'number') {
      return 'agNumberColumnFilter';
    }
    return 'agTextColumnFilter';
  }

  private generateDataOfDefaultField(fieldName: string, fieldSelect: string) {
    const found = SpecialFields.find(col => col.field === fieldName || col.fieldSubmit === fieldName);
    return !!found ? !!found[fieldSelect] ? found[fieldSelect] : undefined : undefined;
  }

  private generateHeaderName(column: any) {
    if (!this.isCbu && column.columnCodeFormat === 'pdiLocId') {
      return 'TSC location';
    }
    if (!this.isCbu && column.columnCodeFormat === 'pdiYardArea') {
      return 'TSC yard area';
    }
    if (!this.isCbu && column.columnCodeFormat === 'mlTruckType') {
      return 'Means';
    }
    if (!!this.isCbu && column.columnCodeFormat === 'dlrTruckType') {
      return 'Means';
    }
    return !!column.columnDes ? column.columnDes : column.columnCode;
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

  agCellValueChanged(params) {
    if (params.oldValue === params.newValue || !params.newValue) {
      return;
    }
    const found = SpecialFields.find(item => item.field === params.colDef.field);
    switch (params.colDef.field) {
      case 'dealerId':
      case 'assChangeFrom':
      case 'mlOtherDlr':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.dealers, 'id', 'id', params.newValue);
        break;
      case 'audio':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.audios, 'id', found.displayField, params.newValue);
        break;
      case 'pdiYardArea':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.areas, 'id', 'id', params.newValue);
        break;
      case 'dlrDeliveryAtId':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.deliveryAddresses, 'id', 'id', params.newValue);
        break;
      case 'damageInsCompany':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.insuranceCompanies, 'id', found.displayField, params.newValue);
        break;
      case 'interLog':
      case 'swapLog':
      case 'hpLogisticCompany':
      case 'pdiLogistic':
      case 'mlLogisticCompanyId':
      case 'dlrLogId':
      case 'pdiLogisticCompany':
      case 'mlLogistic':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.logisticCompanies, 'id', 'id', params.newValue);
        break;
      case 'interMeanTrans':
      case 'swapTructType':
      case 'dlrTruckType':
      case 'hpTruckType':
      case 'mlTruckType':
      case 'pdiTructType':
      case 'clTruckType':
      case 'spctTruckType':
      case 'pdiTruckType':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.transportTypes, 'id', found.displayField, params.newValue);
        break;
      case 'mlYardArea':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.VPYardRegions, 'id', found.displayField, params.newValue);
        break;
      case 'mlYardLoc':
      case 'yardLoc':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.yardLocations, 'id', found.displayField, params.newValue);
        break;
      case 'loc':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.VPYardLocations, 'id', found.displayField, params.newValue);
        break;
      case 'interTruct':
      case 'swapTruct':
      case 'dlrTruck':
      case 'mlTruck':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.trucks, 'id', found.displayField, params.newValue);
        break;
      case 'fleetCustomer':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.fleetCustomers, 'id', found.displayField, params.newValue);
        break;
      case 'dlrColRq':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.allColors, 'id', found.displayField, params.newValue);
        break;
      case 'dealerRequestColorId':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.cbuCkdColors, 'id', 'id', params.newValue);
        break;
      case 'intColor':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.cbuCkdIntColors, 'id', found.displayField, params.newValue);
        break;
      case 'extColor':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.cbuCkdColors, 'colorId', found.displayField, params.newValue);
        break;
      case 'pdiLocId':
        params.data[found.fieldSubmit] = this.getKeyFieldValue(this.yardNotNoParkingLocations, 'id', 'id', params.newValue);
        break;
    }

    const submitedData = !!found ? [{
        vehicle: {
          id: params.data.id,
          [!!found.fieldSubmit ? found.fieldSubmit : params.colDef.field]: !!found.fieldSubmit ? params.data[found.fieldSubmit] : params.newValue
        }
      }]
      : [{vehicle: {id: params.data.id, [params.colDef.field]: params.newValue}}];

    this.cbuVehicleInfoService.saveChanges(this.cbuOrCkd, submitedData)
      .subscribe(res => {
        res.message.toLowerCase() === 'success' ? this.toastService.openSuccessModal() : this.toastService.openWarningModal(res.message);
        params.node.setData(res.data);
      });
  }

  getKeyFieldValue(mappings: Array<any>, key: string, lookup: string, value) {
    const founded = this.lookupKey(mappings, key, lookup, value);
    return founded === '' ? null : founded;
  }

  changePaginationParams(paginationParams) {
    if (!this.vehicles) {
      return;
    }
    const filters = paginationParams.filters.map(paginationParam => {
      paginationParam.fieldFilter = paginationParam.fieldFilter.replace(new RegExp('_1$'), '');
      return paginationParam;
    });
    this.paginationParams = Object.assign({}, paginationParams, {filters});
    this.searchVehicles();
  }

  callbackGrid(params, isCbu) {
    if (isCbu) {
      this.customInfoParamsCbu = params;
    }
    if (!isCbu) {
      this.customInfoParamsCkd = params;
    }
    // Khi chọn các group được hiển thị thì load lại grid-table-component và gán lại dữ liệu
    this.loadingService.setDisplay(false);
    params.api.setRowData(this.vehicles);
  }

  // Các api sẽ được gọi dựa trên các group đã chọn
  getYardLocationAvailable() {
    return this.yardLocationService.getAllYardLocationAvailable();
  }

  getYardLocationVP() {
    return this.yardLocationService.getYardLocationOfYVP();
  }

  getInsuranceCompanies() {
    return this.insuranceCompanyService.getInsuranceCompanyAvailable();
  }

  getLogisticCompanyAvailable() {
    return this.logisticsCompanyService.getLogisticCompanyAvailable();
  }

  getTransportTypeAvailable() {
    return this.transportTypeService.getTransportTypeAvailable();
  }

  getTrucksAvailable() {
    return this.truckService.getAllTrucksAvailable();
  }

  getAllDlrDeliveryAtAddress() {
    return this.dealerAddressDeliveryService.getAvailableList();
  }

  getAudiosAvailable() {
    return this.audioManagementService.getAvailableAudios();
  }

  getFleetCustomer() {
    return this.fleetCustomerService.getAllFleetCustomer();
  }

  getColorsAvailable() {
    return this.colorListService.getColorsAvailable();
  }

  getColorsForCbuCkd() {
    return this.colorAssignmentService.getAllColorsForCbuCkd();
  }

  getIntColorsForCbuCkd() {
    return this.interiorAssignmentService.getAllIntColorsForCbuCkd();
  }

  getYardRegionVP() {
    return this.yardAreaService.getYardRegionVP();
  }

  getYardLocationParkingNotNo() {
    return this.yardLocationService.getYardLocationParkingNotNo();
  }

  getYardNo() {
    return !!this.isCbu ? this.yardAreaService.getYardNo() : this.yardAreaService.getYardRegionBD();
  }

}
