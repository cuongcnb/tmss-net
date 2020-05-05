import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
  BsDropdownModule,
  CollapseModule,
  DatepickerModule,
  ModalModule,
  TimepickerModule,
  TooltipModule,
  TypeaheadModule
} from 'ngx-bootstrap';
import {AgGridModule} from 'ag-grid-angular';
import {TreeModule} from 'angular-tree-component';
import {FileUploadModule} from 'ng2-file-upload';
import {DragulaModule} from 'ng2-dragula';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {ContextMenuModule} from 'ngx-contextmenu';
import {ResizableModule} from 'angular-resizable-element';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {NgxEditorModule} from 'ngx-editor';

import {FormValidationModule} from './form-validation/form-validation.module';
// import {FooterComponent} from './layout/footer.component';
import {HeaderComponent} from './layout/header.component';
import {SidebarComponent} from './layout/sidebar.component';
import {CheckboxComponent} from './checkbox/checkbox.component';
import {LoadingService} from './loading/loading.service';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {TabDisplayDirective} from './tab-display/tab-display.directive';
import {SidebarItemComponent} from './layout/sidebar-item.component';
import {SetModalHeightService} from './common-service/set-modal-height.service';
import {ImageCropperModule} from './image-cropper/image-cropper.module';
import {ReportByMonthComponent} from '../application/services-report/report-by-month/report-by-month.component';
import {ReportInRangeDateComponent} from '../application/services-report/report-in-range-date/report-in-range-date.component';
import {ReportByAccessoryComponent} from '../application/services-report/report-by-accessory/report-by-accessory.component';
import {ReportWithTabComponent} from '../application/services-report/report-with-tab/report-with-tab.component';
import {InOutGateReportComponent} from '../application/cashier/in-out-gate-report/in-out-gate-report.component';
import {ProgressReportComponent} from '../application/coo/progress-report/progress-report.component';
import {CustomerServiceReportComponent} from '../application/services-report/customer-service-report/customer-service-report.component';
import {StockInventoryReportByPriceComponent} from '../application/services-report/stock-inventory-report-by-price/stock-inventory-report-by-price.component';
import {GridTableComponent} from './ag-grid-table/grid-table.component';
import {GridTableSaleComponent} from './ag-grid-table-sale/grid-table-sale.component';
import {MultiColumnSelectControlComponent} from './multi-column-select-control/multi-column-select-control.component';
import {MonthPickerComponent} from './month-picker/month-picker.component';
import {DataFormatService} from './common-service/data-format.service';
import {TmssDatepickerComponent} from './tmss-datepicker/tmss-datepicker.component';
import {CellTableEditModalComponent} from './cell-table-edit-modal/cell-table-edit-modal.component';
import {CommonService} from './common-service/common.service';
import {PaginationComponent} from './ag-grid-table/pagination/pagination.component';
import {ConfirmationComponent} from './confirmation/confirmation.component';
import {FindOperationModalComponent} from './find-operation-modal/find-operation-modal.component';
import {TmssExportComponent} from './tmss-export/tmss-export.component';
import {InputSearchComponent} from './input-search/input-search.component';
import {SearchDataGridModalComponent} from './search-data-grid-modal/search-data-grid-modal.component';
import {PreventKeyupFormControlDirective} from './form-validation/preventKeyupFormControl.directive';
import {AgSelectRendererComponent} from './ag-select-renderer/ag-select-renderer.component';
import {TmssDatepickerMiniComponent} from './tmss-datepicker-mini/tmss-datepicker-mini.component';
import {AgDatepickerRendererComponent} from './ag-datepicker-renderer/ag-datepicker-renderer.component';
import {AgDataValidateService} from './ag-grid-table/ag-data-validate/ag-data-validate.service';
import {HourTrackingComponent} from './hour-tracking/hour-tracking.component';
import {ResizeableProgressComponent} from './resizeable-progress/resizeable-progress.component';
import {ImageUploaderComponent} from './image-uploader/image-uploader.component';
import {AgInCellButtonComponent} from './ag-in-cell-button/ag-in-cell-button.component';
import {TmssTimepickerComponent} from './tmss-timepicker/tmss-timepicker.component';
import {FileUploaderComponent} from './file-uploader/file-uploader.component';

import {MultiCheckboxSelectComponent} from './multi-checkbox-select/multi-checkbox-select.component';
import {ListDealCarComponent} from '../application/search-extract-data/list-deal-car/list-deal-car.component';
import {ImportDataSurveyComponent} from '../application/ssi-survey/import-data-survey/import-data-survey.component';
import {TimeChoosingComponent} from './tmss-datepicker/time-choosing/time-choosing.component';
import {TimeChoosingSaleComponent} from './tmss-datetimepicker-sale/time-choosing-sale/time-choosing-sale.component';
import {AgCheckboxRendererComponent} from './ag-checkbox-renderer/ag-checkbox-renderer.component';
import {AgCheckboxHeaderRendererComponent} from './ag-checkbox-header-renderer/ag-checkbox-header-renderer.component';

import {TmssTextEditorComponent} from './tmss-text-editor/tmss-text-editor.component';
import {LaborWagesComponent} from '../application/service-kpi-data/labor-wages/labor-wages.component';
import {NewLaborWagesComponent} from '../application/service-kpi-data/labor-wages/new-labor-wages/new-labor-wages.component';
import {LaborWagesNationwideComponent} from '../application/service-kpi-data/labor-wages-nationwide/labor-wages-nationwide.component';
import {NewLaborWagesNationwideComponent} from '../application/service-kpi-data/labor-wages-nationwide/new-labor-wages-nationwide/new-labor-wages-nationwide.component';
import {TmssMoneyInputComponent} from './tmss-money-input/tmss-money-input.component';
import {AddonWidthDirective} from './addon-width/addon-width.directive';
import {CheckboxListComponent} from './checkbox-list/checkbox-list.component';
import {TmssTooltipComponent} from './tmss-tooltip/tmss-tooltip.component';
import {LoadingComponent} from './loading/loading.component';
import {TmssDatePipe} from './pipe/pipe';
import {ValidateBeforeSearchService} from './common-service/validate-before-search.service';
import {WarrantyAmountInputComponent} from './warranty-amount-input/warranty-amount-input.component';
import {QuickSearchByOneFieldComponent} from './quick-search-by-one-field/quick-search-by-one-field.component';
import {TmssMonthYearComponent} from './tmss-month-year/tmss-month-year.component';
import {TmssMonthYearSaleComponent} from './tmss-month-year-sale/tmss-month-year-sale.component';
import {GoUpButtonComponent} from '../application/advisor/customer-info/proposal/go-up-button/go-up-button.component'
// SERVICE REPORT
import {PartImportExportHistoryReportComponent} from '../application/services-report/part-import-export-history-report/part-import-export-history-report.component';
import {PartAmountAdjustmentReportComponent} from '../application/services-report/part-amount-adjustment-report/part-amount-adjustment-report.component';
import {PartImportExportReportComponent} from '../application/services-report/part-import-export-report/part-import-export-report.component';
import {TmssInputSearchValueComponent} from './tmss-input-search-value/tmss-input-search-value.component';
import {PartSupplyRateByPartCodeReportComponent} from '../application/services-report/part-supply-rate-by-part-code-report/part-supply-rate-by-part-code-report.component';
import {PartsSupplyRatioReportComponent} from '../application/services-report/parts-supply-ratio-report/parts-supply-ratio-report.component';
import {ReportReceiveComponent} from '../application/services-report/report-receive/report-receive.component';
import {RoGeneralReportComponent} from '../application/services-report/ro-general-report/ro-general-report.component';
import {PartsCheckInventoryReportComponent} from '../application/services-report/parts-check-inventory-report/parts-check-inventory-report.component';
import {AccessoryInventoryCheckReportComponent} from '../application/services-report/accessory-inventory-check-report/accessory-inventory-check-report.component';
import {OutputReportComponent} from '../application/services-report/output-report/output-report.component';
import {AccessorySellingReportComponent} from '../application/services-report/accessory-selling-report/accessory-selling-report.component';
import {ImagePreviewDirective} from './file-uploader/image-preview.directive';
import {BtnClickDebounceDirective} from './btn-click-debounce/btn-click-debounce.directive';
import {ReportTypeModalComponent} from './report-type-modal/report-type-modal.component';
import {RetailSalesReportComponent} from '../application/services-report/retail-sales-report/retail-sales-report.component';
import {OweTmvReportComponent} from '../application/services-report/owe-tmv-report/owe-tmv-report.component';
import {PartRetailGeneralReportComponent} from '../application/services-report/part-retail-general-report/part-retail-general-report.component';
import {ServiceRateAndRoFillReportComponent} from '../application/services-report/service-rate-and-ro-fill-report/service-rate-and-ro-fill-report.component';
import {VehicleSummaryReportComponent} from '../application/services-report/vehicle-summary-report/vehicle-summary-report.component';
import {AppointmentReportComponent} from '../application/services-report/appointment-report/appointment-report.component';
import {RoUnfinishedReportComponent} from '../application/services-report/ro-unfinished-report/ro-unfinished-report.component';
import {RoListWithFullPartComponent} from '../application/services-report/ro-list-with-full-part/ro-list-with-full-part.component';
import {TimeStoreBoComponent} from '../application/services-report/time-store-bo/time-store-bo.component';
import {ReloadProgressCustomerService} from './reload-progress-customer/reload-progress-customer.service';
import {NextShortcutService} from './common-service/nextShortcut.service';
import {OrderOfDlrToTmvComponent} from '../application/services-report/order-of-dlr-to-tmv/order-of-dlr-to-tmv.component';
import {ListRoPartBoNotEnoughComponent} from '../application/services-report/list-ro-part-bo-not-enough/list-ro-part-bo-not-enough.component';
import {DecentralizedInspectionAgentQualityComponent} from '../application/services-report/decentralized-inspection-agent-quality/decentralized-inspection-agent-quality.component';
import {DynamicTabComponent} from './dynamic-tab/dynamic-tab.component';
import {PageTitleDirective} from './page-title/page-title.directive';
import {FleetFollowUpFilterComponent} from '../application/fleet-sale/fleet-follow-up/fleet-follow-up-filter/fleet-follow-up-filter.component';
import {AutoFocusDirective} from './auto-focus/auto-focus.directive';
import {SaleFilterComponent} from './sale-filter/sale-filter.component';
import {SwalAlertComponent} from './swal-alert/swal-alert.component';
import {CommaFormatPipe} from './pipe/comma-format.pipe';
import {SaveSaleFilterModalComponent} from './sale-filter/save-sale-filter-modal/save-sale-filter-modal.component';
import {EditFilterRowModalComponent} from './sale-filter/edit-filter-row-modal/edit-filter-row-modal.component';
import {AgCellEditModalComponent} from './ag-cell-edit-modal/ag-cell-edit-modal.component';
import {ReportComponent} from '../application/dlr/report/report.component';
import {ContractFilterStartModalComponent} from '../application/daily-sale/contract-management/contract-filter-start-modal/contract-filter-start-modal.component';
import {CbuFilterStartModalComponent} from '../application/daily-sale/cbu-vehicle-info/cbu-filter-start-modal/cbu-filter-start-modal.component';
import {DeliveryFilterStartModalComponent} from '../application/daily-sale/change-delivery/delivery-filter-start-modal/delivery-filter-start-modal.component';
import {VehicleArrivalFilterModalComponent} from '../application/daily-sale/vehicle-arrival/vehicle-arrival-filter-modal/vehicle-arrival-filter-modal.component';
import {PageTitleService} from './page-title/page-title.service';
import {CompareDataService} from './common-service/compare-data.service';
import {GridExportService} from './common-service/grid-export.service';
import {ToastService} from './swal-alert/toast.service';
import {AgMonthEditorComponent} from './ag-grid-table/ag-monthpicker-editor/ag-month-editor.component';
import {AgDateEditorComponent} from './ag-grid-table/ag-datepicker-editor/ag-date-editor.component';
import {AgTimeEditorComponent} from './ag-grid-table/ag-timepicker-editor/ag-time-editor.component';
import {InputMaskModule} from 'primeng/inputmask';
import {FormFocusErrorFieldDirective} from './form-validation/form-focus-error-field.directive';
import {CbuDisplayChoosingModalComponent} from '../application/daily-sale/cbu-vehicle-info/cbu-display-choosing-modal/cbu-display-choosing-modal.component';
import {TmssDatepickerSaleComponent} from './tmss-datepicker-sale/tmss-datepicker-sale.component';
import {TmssDatetimepickerSaleComponent} from './tmss-datetimepicker-sale/tmss-datetimepicker-sale.component';
import {WarrantyDailyClaimReportComponent} from '../application/warranty-new/warranty-daily-claim-report/warranty-daily-claim-report.component';
import {NumericEditor} from './ag-grid-table/numeric-editor/numeric-editor.component';
import {UserListFunctionComponent} from '../application/system-admin/user-list-function/user-list-function.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    dateInputFormat: 'DD/MM/YYYY'
  });
}

const Layout = [
  // FooterComponent,
  SidebarComponent,
  HeaderComponent
];

const FilterStartComponents = [
  InOutGateReportComponent,
  ProgressReportComponent,
  ListDealCarComponent,
  ImportDataSurveyComponent,
  LaborWagesComponent,
  NewLaborWagesComponent,
  LaborWagesNationwideComponent,
  NewLaborWagesNationwideComponent,
  WarrantyDailyClaimReportComponent,
  UserListFunctionComponent,

  // SERVICE REPORT
  CustomerServiceReportComponent,
  ReportByAccessoryComponent, // đại lý, từ ngày, đến ngày, định dạng file, phụ tùng (mã + loại), nhóm theo
  ReportByMonthComponent, // đại lý, tháng
  ReportInRangeDateComponent, // đại lý, từ ngày, đến ngày, định dạng file, others
  ReportWithTabComponent, // đại lý, ngày/ tháng/ năm/ từ ngày đến ngày
  VehicleSummaryReportComponent,
  AppointmentReportComponent, // Báo cáo đặt hẹn theo ngày

  StockInventoryReportByPriceComponent,
  PartImportExportHistoryReportComponent,
  PartAmountAdjustmentReportComponent,
  PartImportExportReportComponent,
  PartSupplyRateByPartCodeReportComponent,
  PartImportExportReportComponent,
  PartsSupplyRatioReportComponent,
  ReportReceiveComponent,
  RoGeneralReportComponent,
  PartsCheckInventoryReportComponent,
  AccessoryInventoryCheckReportComponent,
  OutputReportComponent,
  AccessorySellingReportComponent,
  RetailSalesReportComponent,
  OweTmvReportComponent,
  DecentralizedInspectionAgentQualityComponent,
  ServiceRateAndRoFillReportComponent,
  PartRetailGeneralReportComponent,
  RoUnfinishedReportComponent,
  RoListWithFullPartComponent,
  OrderOfDlrToTmvComponent,
  TimeStoreBoComponent,
  ListRoPartBoNotEnoughComponent
];
const FilterStartModals = [
  VehicleArrivalFilterModalComponent,
  DeliveryFilterStartModalComponent,
  CbuFilterStartModalComponent,
  ContractFilterStartModalComponent,
  ReportComponent
];

@NgModule({

    imports: [
        InputMaskModule,
        CommonModule,
        PerfectScrollbarModule,
        FlexLayoutModule,
        FormsModule,
        BsDropdownModule,
        ReactiveFormsModule,
        HttpClientModule,
        DragDropModule,
        ScrollingModule,
        CdkTableModule,
        CdkTreeModule,
        ContextMenuModule.forRoot(),
        ResizableModule,
        AgGridModule.withComponents([
            AgSelectRendererComponent, AgDatepickerRendererComponent,
            AgInCellButtonComponent, AgCheckboxRendererComponent,
            AgCheckboxHeaderRendererComponent, AgDateEditorComponent,
            AgMonthEditorComponent, AgTimeEditorComponent,
            NumericEditor
        ]),
        FileUploadModule,
        RouterModule,
        ModalModule,
        ImageCropperModule,
        FormValidationModule,
        SweetAlert2Module,
        DragulaModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        TooltipModule.forRoot(),
        TreeModule.forRoot(),
        CollapseModule.forRoot(),
        NgMultiSelectDropDownModule.forRoot(),
        NgxEditorModule,


        // ---------------------SALE------------------
        TypeaheadModule,
        ImageCropperModule,
        FormValidationModule,
        BsDatepickerModule.forRoot(),
        DatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        TreeModule.forRoot(),
        TooltipModule.forRoot(),
    ],
  declarations: [
    AgDatepickerRendererComponent,
    AgCheckboxRendererComponent,
    FormFocusErrorFieldDirective,
    AgSelectRendererComponent,
    CbuDisplayChoosingModalComponent,
    Layout,
    GridTableComponent,
    GridTableSaleComponent,
    DynamicTabComponent,
    MultiColumnSelectControlComponent,
    MonthPickerComponent,
    TmssMonthYearComponent,
    TmssMonthYearSaleComponent,
    CheckboxComponent,
    TmssDatepickerComponent,
    TmssDatepickerSaleComponent,
    TmssDatetimepickerSaleComponent,
    TmssTimepickerComponent,
    FilterStartComponents,
    PaginationComponent,
    TmssDatePipe,
    TabDisplayDirective,
    ConfirmationComponent,
    SidebarItemComponent,
    FindOperationModalComponent,
    HourTrackingComponent,
    InputSearchComponent,
    SearchDataGridModalComponent,
    QuickSearchByOneFieldComponent,
    TmssExportComponent,
    CellTableEditModalComponent,
    PreventKeyupFormControlDirective,
    AgSelectRendererComponent,
    TmssDatepickerMiniComponent,
    AgDatepickerRendererComponent,
    ResizeableProgressComponent,
    AgInCellButtonComponent,
    MultiCheckboxSelectComponent,
    TimeChoosingComponent,
    TimeChoosingSaleComponent,
    AgCheckboxRendererComponent,
    AgCheckboxHeaderRendererComponent,
    TmssTextEditorComponent,
    TmssMoneyInputComponent,
    ImageUploaderComponent,
    CheckboxListComponent,
    TmssTooltipComponent,
    LoadingComponent,
    FileUploaderComponent,
    AddonWidthDirective,
    TmssInputSearchValueComponent,
    WarrantyAmountInputComponent,
    ReportTypeModalComponent,
    ImagePreviewDirective,
    BtnClickDebounceDirective,
    GoUpButtonComponent,
    // -------------------SALE----------------------

    PageTitleDirective,
    FilterStartModals,
    SaleFilterComponent,
    FleetFollowUpFilterComponent,
    AutoFocusDirective,
    SwalAlertComponent,
    CommaFormatPipe,
    SaveSaleFilterModalComponent,
    EditFilterRowModalComponent,
    AgCellEditModalComponent,
    AgDateEditorComponent,
    AgTimeEditorComponent,
    AgMonthEditorComponent,
    NumericEditor
  ],
  exports: [
    AgDatepickerRendererComponent,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    PerfectScrollbarModule,
    BsDropdownModule,
    ModalModule,
    Layout,
    DragDropModule,
    ScrollingModule,
    LoadingComponent,
    TmssDatePipe,
    CdkTableModule,
    CdkTreeModule,
    DragulaModule,
    ResizeableProgressComponent,
    ReactiveFormsModule,
    CheckboxListComponent,
    PaginationComponent,
    DynamicTabComponent,
    HttpClientModule,
    FileUploadModule,
    ContextMenuModule,
    ResizableModule,
    AgGridModule,
    RouterModule,
    ImageCropperModule,
    FormValidationModule,
    GridTableComponent,
    GridTableSaleComponent,
    TmssExportComponent,
    SweetAlert2Module,
    BsDatepickerModule,
    CollapseModule,
    TimepickerModule,
    InputSearchComponent,
    TooltipModule,
    TabDisplayDirective,
    MonthPickerComponent,
    TmssMonthYearComponent,
    TmssMonthYearSaleComponent,
    TimeChoosingComponent,
    TimeChoosingSaleComponent,
    HourTrackingComponent,
    ConfirmationComponent,
    MultiColumnSelectControlComponent,
    CheckboxComponent,
    TmssDatepickerComponent,
    TmssDatepickerSaleComponent,
    TmssDatetimepickerSaleComponent,
    TmssTimepickerComponent,
    AgTimeEditorComponent,
    AgMonthEditorComponent,
    AgDateEditorComponent,
    NumericEditor,
    FilterStartComponents,
    CellTableEditModalComponent,
    TreeModule,
    SearchDataGridModalComponent,
    QuickSearchByOneFieldComponent,
    PreventKeyupFormControlDirective,
    TmssDatepickerMiniComponent,
    AgSelectRendererComponent,
    AgDatepickerRendererComponent,
    ImageUploaderComponent,
    FileUploaderComponent,
    TmssTooltipComponent,
    FindOperationModalComponent,
    AgInCellButtonComponent,
    NgMultiSelectDropDownModule,
    MultiCheckboxSelectComponent,
    AgCheckboxRendererComponent,
    AgCheckboxHeaderRendererComponent,
    NgxEditorModule,
    TmssTextEditorComponent,
    TmssMoneyInputComponent,
    AddonWidthDirective,
    TmssInputSearchValueComponent,
    WarrantyAmountInputComponent,
    ImagePreviewDirective,
    BtnClickDebounceDirective,
    ReportTypeModalComponent,
    GoUpButtonComponent,
    // ------------SALE
    TypeaheadModule,
    SaleFilterComponent,
    AgCellEditModalComponent,
    PageTitleDirective,
    FilterStartModals

  ],
  providers: [
    DataFormatService,
    LoadingService,
    SetModalHeightService,
    CommonService,
    AgDataValidateService,
    ValidateBeforeSearchService,
    ReloadProgressCustomerService,
    NextShortcutService,
    {provide: BsDatepickerConfig, useFactory: getDatepickerConfig},
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    PageTitleService,
    GridExportService,
    CompareDataService,
    ToastService,
    {provide: BsDatepickerConfig, useFactory: getDatepickerConfig},
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  entryComponents: [
    ResizeableProgressComponent,
    LoadingComponent,
    TimeChoosingComponent,
    TimeChoosingSaleComponent,
    GoUpButtonComponent,
  ]
})
export class SharedModule {
}
