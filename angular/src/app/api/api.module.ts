import {ModuleWithProviders, NgModule} from '@angular/core';
import {BaseApiService} from './base-api.service';
import {CoreModule} from '../core/core.module';
import {DlrClaimStatusReportApi} from './warranty/dlr-claim-status-report.api';
import {HttpClientModule} from '@angular/common/http';
import {DivisionCommonApi} from './common-api/division-common.api';
import {SuppliersCommonApi} from './common-api/suppliers-common.api';
import {CampaignManagementApi} from './master-data/warranty/campaign-management.api';
import {VinAffectedByCampaignApi} from './master-data/warranty/vin-affected-by-campaign.api';
import {ImportVinAffectedByCampaignApi} from './master-data/import/import-vin-affected-by-campaign.api';
import {PartsManualOrderApi} from './parts-management/parts-manual-order.api';
import {CampaignOpemApi} from './master-data/warranty/campaign-opem.api';
import {SrvDRcJobsApi} from './master-data/warranty/srv-d-rc-jobs.api';
import {PartsInfoManagementApi} from './parts-management/parts-info-management.api';
import {PartsManagementApi} from './parts-management/parts-management.api';
import {DealerApi} from './sales-api/dealer/dealer.api';
import {AuthApi} from './auth/auth.api';
import {PartsSpecialOrderApi} from './parts-management/parts-special-order.api';
import {ShopCommonApi} from './common-api/shop-common.api';
import {ShopTypeCommonApi} from './common-api/shop-type-common.api';
import {DlrFooterApi} from './master-data/catalog-declaration/dlr-footer.api';
import {PartsInStockStatusApi} from './parts-management/parts-in-stock-status.api';
import {QueuingApi} from './queuing-system/queuing.api';
import {DistrictApi} from './sales-api/district/district.api';
import {ProvinceApi} from './sales-api/province/province.api';
import {CustomerApi} from './customer/customer.api';
import {PartTypesApi} from './parts-management/part-types.api';
import {PartsInStockAdjustmentApi} from './parts-management/parts-in-stock-adjustment.api';
import {DeskAdvisorApi} from './master-data/catalog-declaration/desk-advisor.api';
import {DlrFloorApi} from './master-data/catalog-declaration/dlr-floor.api';
import {UnitCommonApi} from './common-api/unit-common.api';
import {RepairOrderApi} from './quotation/repair-order.api';
import {CustomerTypeApi} from './customer/customer-type.api';
import {StandardizeCustomerApi} from './customer/standardize-customer.api';
import {InsuranceApi} from './sales-api/insurance/insurance.api';
import {EmployeeCommonApi} from './common-api/employee-common.api';
import {PartsRetailApi} from './parts-management/parts-retail.api';
import {PartsReceiveAutomaticApi} from './parts-management/parts-receive-automatic.api';
import {LexusReturnToDealerApi} from './parts-management/lexus-return-to-dealer.api';
import {LookupApi} from './sales-api/lookup/lookup.api';
import {AuthorizeApi} from './system-admin/authorize.api';
import {SystemFunctionListApi} from './system-admin/system-function-list.api';
import {SystemUserGroupDefinitionApi} from './system-admin/system-user-group-definition.api';
import {SysUserApi} from './system-admin/sys-user.api';
import {SectionApi} from './system-admin/section.api';
import {BankApi} from './common-api/bank.api';
import {LaborRateMaintenanceApi} from './common-api/labor-rate-maintenance.api';
import {CountryApi} from './common-api/country.api';
import {PartsReceiveManualApi} from './parts-management/parts-receive-manual.api';
import {DlrDisplayScreenApi} from './warranty/dlr-display-screen.api';
import {BoPartsOrderApi} from './parts-management/bo-parts-order.api';
import {PartsCancelOrderRequestApi} from './parts-management/parts-cancel-order-request.api';
import {GradeApi} from './sales-api/grade/grade.api';
import {RcTypeApi} from './rc-type/rc-type.api';
import {ModelApi} from './sales-api/model/model.api';
import {DlrUnclaimOrderApi} from './warranty/dlr-unclaim-order.api';
import {PartsLookupInfoApi} from './parts-management/parts-lookup-info.api';
import {EngineTypeApi} from './engine-type/engine-type.api';
import {VehicleColorApi} from './vehicle-color/vehicle-color.api';
import {CustomerDetailApi} from './customer/customer-detail.api';
import {DlrWarrantySearchApi} from './warranty/dlr-warranty-search.api';
import {DlrClaimReportApi} from './warranty/dlr-claim-report.api';
import {ClaimDetailApi} from './warranty/claim-detail.api';
import {DlrClaimWatingOrderApi} from './warranty/dlr-claim-wating-order.api';
import {VehicleInfoApi} from './warranty/vehicle-info.api';
import {ClaimStatusReportApi} from './warranty/claim-status-report.api';
import {TechWshopApi} from './tech-wshop/tech-wshop.api';
import {EmployeeTypeApi} from './common-api/employee-type.api';
import {TitleApi} from './common-api/title.api';
import {TransportTypeApi} from './common-api/transport-type.api';
import {PackOfPartsApi} from './parts-management/pack-of-part/pack-of-parts.api';
import {PackOfPartDetailApi} from './parts-management/pack-of-part/pack-of-part-detail.api';
import {OrderMethodApi} from './common-api/order-method.api';
import {PartsOrderForStoringApi} from './parts-management/parts-order-for-storing.api';
import {AppoinmentApi} from './appoinment/appoinment.api';
import {TCodeApi} from './common-api/t-code.api';
import {SubletApi} from './common-api/sublet.api';
import {ErrorCodeApi} from './common-api/error-code.api';
import {VenderApi} from './common-api/vender.api';
import {PayCodeApi} from './common-api/pay-code.api';
import {DlrConfigApi} from './common-api/dlr-config.api';
import {DeadStockPartApi} from './parts-management/dead-stock-part.api';
import {PartOrderPrePlanApi} from './parts-management/part-order-pre-plan.api';
import {ServiceCodeApi} from './common-api/service-code.api';
import {CarModelApi} from './common-api/car-model.api';
import {CarFamilyApi} from './common-api/car-family.api';
import {RepairJobApi} from './common-api/repair-job.api';
import {PartsUpcommingApi} from './parts-management/parts-upcomming.api';
import {PartsExportLackLookupApi} from './parts-management/parts-export-lack-lookup.api';
import {RepairBodyApi} from './common-api/repair-body.api';
import {PartsCancelTrackingApi} from './parts-management/parts-cancel-tracking.api';
import {PartsExportApi} from './parts-management/parts-export.api';
import {BoOrderFollowupApi} from './parts-management/bo-order-followup.api';
import {DealerIpConfigApi} from './sales-api/dealer-ip-config/dealer-ip-config.api';
import {SendClaimApi} from './parts-management/send-claim.api';
import {PendingReasonApi} from './pending-reason/pending-reason.api';
import {EmpCalendarApi} from './emp-calendar/emp-calendar.api';
import {PartsRepairPositionPrepickApi} from './parts-management/parts-repair-position-prepick.api';
import {RoWshopApi} from './ro-wshop/ro-wshop.api';
import {MipCalculateApi} from './parts-management/mip-calculate.api';
import {PartsOnhandOrderFollowupApi} from './parts-management/parts-onhand-order-followup.api';
import {RoLackOfPartExportApi} from './parts-management/ro-lack-of-part-export.api';
import {PartsCheckPriceCodeApi} from './parts-management/parts-check-price-code.api';
import {RoWshopActApi} from './ro-wshop/ro-wshop-act.api';
import {PartsReceiveHistoryApi} from './parts-management/parts-receive-history.api';
import {RepairJobDetailApi} from './common-api/repair-job-detail.api';
import {StorageQuotationApi} from './quotation/storage-quotation.api';
import {CurrencyApi} from './common-api/currency.api';
import {MipImportApi} from './parts-management/mip-import.api';
import {VehicleApi} from './vehicle/vehicle.api';
import {CashierApi} from './dlr-cashier/cashier.api';
import {CarNotSettlementOutGateApi} from './dlr-cashier/car-not-settlement-out-gate.api';
import {InsuranceServiceApi} from './common-api/insurance-service.api';
import {InsuranceEmployeeApi} from './common-api/insurance-employee.api';
import {UnfWorkAdvisorApi} from './advisor/unf-work-advisor.api';
import {InvCusApi} from './dlr-cashier/inv-cus.api';
import {InvCusDApi} from './dlr-cashier/inv-cus-d.api';
import {CasOutGateApi} from './dlr-cashier/cas-out-gate.api';
import {PartShippingHistoryApi} from './parts-management/part-shipping-history.api';
import {HomeApi} from './home.api';
import {WarrantyPartsApi} from './warranty/warranty-parts.api';
import {VehicleHistoryApi} from './vehicle-history/vehicle-history.api';
import {UserManagementApi} from './system-admin/user-management.api';
import {DlrLexusListApi} from './srv-master-lexus/dlr-lexus-list.api';
import {MasterLexusApi} from './srv-master-lexus/master-lexus.api';
import {LexusOrderApi} from './lexus-order/lexus-order.api';
import {OrderForLexusPartApi} from './parts-management/order-for-lexus-part.api';
import {PartsNonLexusOrderLexusApi} from './parts-management/parts-non-lexus-order-lexus.api';
import {PartsReceiveManualLexusApi} from './parts-management/parts-receive-manual-lexus.api';
import {InsuranceNewEmpApi} from './sales-api/insurance-new-emp.api/insurance-new-emp.api';
import {RepairPlanApi} from './repair-plan/repair-plan.api';
import {InsuranceDoctypeApi} from './common-api/insurance-doctype.api';
import {NewInfomationApi} from './new-infomation/new-infomation.api';
import {ServiceReportApi} from './service-report/service-report.api';
import {WarrantyTimeSheetApi} from './master-data/warranty/warranty-time-sheet.api';
import {PartsModifyPrepickApi} from './parts-management/parts-modify-prepick.api';
import {McopperPaintApi} from './common-api/mcopper-paint.api';
import {CampaignDlrApi} from './campaign-dlr/campaign-dlr.api';
import {PartSaleDlrToTmvApi} from './parts-management/part-sale-dlr-to-tmv.api';
import {LookupService} from './lookup/lookup.service';
import {DealerListService} from './master-data/dealer-list.service';
import {AuthorizeService} from './system-admin/authorize.service';
import {CustomerService} from './daily-sale/customer.service';
import {VehicleConditionService} from './daily-sale/vehicle-condition.service';
import {SystemUserGroupDefinitionService} from './system-admin/system-user-group-definition.service';
import {SystemFunctionListService} from './system-admin/system-function-list.service';
import {CreateUserService} from './system-admin/create-user.service';
import {NationwideBuyingListService} from './swapping/nationwide-buying-list.service';
import {NationwideSellingListService} from './swapping/nationwide-selling-list.service';
import {SellBuyMatchingService} from './swapping/sell-buy-matching.service';
import {DlrVehicleInformationService} from './swapping/dlr-vehicle-information.service';
import {PaymentFollowupService} from './tfs/payment-followup.service';
import {DlrOrderService} from './dealer-order/dlr-order.service';
import {DealerIpConfigService} from './master-data/dealer-ip-config.service';
import {LocationOfYardService} from './dlr-master-data/location-of-yard.service';
import {FilterService} from './lookup/filter.service';
import {VehicleArrivalService} from './daily-sale/vehicle-arrival.service';
import {DispatchChangeRequestService} from './swapping/dispatch-change-request.service';
import {ReportService} from './dlr-master-data/report-service.service';
import {BankManagementService} from './master-data/bank-management.service';
import {InsuranceCompanyService} from './master-data/insurance-company.service';
import {ProvincesService} from './master-data/provinces.service';
import {AdvanceReportService} from './master-data/advance-report.service';
import {DealerGroupService} from './master-data/dealer-group.service';
import {DistrictListService} from './master-data/district-list.service';
import {ModelListService} from './master-data/model-list.service';
import {YardLocationService} from './master-data/yard-location.service';
import {YardManagementService} from './master-data/yard-management.service';
import {ContractManagementService} from './daily-sale/contract-management.service';
import {EmployeeService} from './master-data/employee.service';
import {CbuVehicleInfoService} from './daily-sale/cbu-vehicle-info.service';
import {TruckService} from './master-data/truck.service';
import {ImportService} from './import/import.service';
import {TransportImageUploaderService} from './master-data/transport-image-uploader.service';
import {FormService} from './admin/form.service';
import {TransportTypeService} from './master-data/transport-type.service';
import {FleetUnitService} from './fleet-sale/fleet-unit.service';
import {ArrivalLeadtimeService} from './master-data/arrival-leadtime.service';
import {InteriorAssignmentService} from './master-data/interior-assignment.service';
import {MeansOfTransportationService} from './master-data/means-of-transportation.service';
import {ListColumnService} from './admin/list-column.service';
import {AudioManagementService} from './master-data/audio-management.service';
import {GroupColumnService} from './admin/group-column.service';
import {FormGroupService} from './admin/form-group.service';
import {FormColumnService} from './admin/form-column.service';
import {PetrolService} from './master-data/petrol.service';
import {InvoiceLeadTimeService} from './master-data/invoice-lead-time.service';
import {FleetCustomerService} from './fleet-sale/fleet-customer.service';
import {YardAreaService} from './master-data/yard-area.service';
import {FleetSchemesService} from './fleet-sale/fleet-schemes.service';
import {FleetSaleApplicationService} from './fleet-sale/fleet-sale-application.service';
import {MoneyDefineService} from './master-data/money-define.service';
import {UserColumnService} from './admin/user-column.service';
import {SalesGroupService} from './dlr-master-data/sales-group.service';
import {SalesPersonService} from './dlr-master-data/sales-person.service';
import {SalesTeamSevice} from './dlr-master-data/sales-team.sevice';
import {SwappingVehicleService} from './swapping/swapping-vehicle.service';
import {DealerBalanceService} from './tfs/dealer-balance.service';
import {GradeListService} from './master-data/grade-list.service';
import {GradeProductionService} from './master-data/grade-production.service';
import {LogisticsCompanyService} from './master-data/logistics-company.service';
import {LexusPartsReceiveHistoryApi} from './lexus-order/lexus-parts-receive-history.api';
import {DealerIpApi} from './system-admin/dealer-ip.api';
import {DealerOrderConfigService} from './dealer-order/dealer-order-config.service';
import {FunctionLogApi} from './master-data/function-log.api';
import {SrvDRcJobsModelsApi} from './master-data/warranty/srv-d-rc-jobs-models.api';
import {SrvDRcRepairPartsApi} from './master-data/warranty/srv-d-rc-repair-parts.api';
import {WebSocketService} from './web-socket.service';
import {UploadService} from './dealer-order/upload.service';
import {DealerVersionTypeService} from './dealer-order/dealer-version-type.service';
import {WarrantyFollowUpApi} from './warranty/warranty-follow-up.api';
import {BpGroupApi} from './bp-group/bp-group.api';
import {TcodeWarningApi} from './warranty/tcode-warning.api';
import {SubletTypeMaintenanceApi} from './warranty/sublet-type-maintenance.api';
import {ExchangeRateMaintenanceApi} from './warranty/exchange-rate-maintenance.api';
import {WarrantyAssignApi} from './warranty/warranty-assign.api';
import {WarrCheckWmiApi} from './warranty/warr-check-wmi.api';
import {VendorMaintenanceApi} from './warranty/vendor-maintenance.api';
import {SoldVehicleMaintenanceApi} from './warranty/sold-vehicle-maintenance.api';
import {VehicleRegistrationApi} from './warranty/vehicle-registration.api';
import { CampaignFollowUpApi } from './warranty/campaign-follow-up.api';


const PartsManagementApiList = [
  DeadStockPartApi,
  PartsManagementApi,
  PartsInfoManagementApi,
  PartsManualOrderApi,
  PartsSpecialOrderApi,
  PartTypesApi,
  PartsInStockStatusApi,
  PartsInStockAdjustmentApi,
  PartsRetailApi,
  PartsReceiveAutomaticApi,
  LexusReturnToDealerApi,
  PartsReceiveManualApi,
  BoOrderFollowupApi,
  BoPartsOrderApi,
  PartsCancelOrderRequestApi,
  PartsLookupInfoApi,
  PartsOrderForStoringApi,
  PartOrderPrePlanApi,
  PackOfPartsApi,
  PackOfPartDetailApi,
  PartsUpcommingApi,
  PartsExportLackLookupApi,
  PartsExportApi,
  RepairBodyApi,
  PartsCancelTrackingApi,
  PartsCancelTrackingApi,
  SendClaimApi,
  PartsRepairPositionPrepickApi,
  MipCalculateApi,
  PartsRepairPositionPrepickApi,
  RoLackOfPartExportApi,
  PartsOnhandOrderFollowupApi,
  PartsCheckPriceCodeApi,
  PartsReceiveHistoryApi,
  MipImportApi,
  PartShippingHistoryApi,
  OrderForLexusPartApi,
  PartsNonLexusOrderLexusApi,
  PartsModifyPrepickApi,
  PartSaleDlrToTmvApi
];

const CommonApi = [
  McopperPaintApi,
  BankApi,
  LaborRateMaintenanceApi,
  CountryApi,
  DivisionCommonApi,
  EmployeeCommonApi,
  EmployeeTypeApi,
  ShopCommonApi,
  ShopTypeCommonApi,
  SuppliersCommonApi,
  UnitCommonApi,
  TitleApi,
  TransportTypeApi,
  TCodeApi,
  SubletApi,
  DlrConfigApi,
  OrderMethodApi,
  ErrorCodeApi,
  VenderApi,
  PayCodeApi,
  ServiceCodeApi,
  CarFamilyApi,
  CarModelApi,
  RepairJobApi,
  RepairJobDetailApi,
  CurrencyApi,
  InsuranceServiceApi,
  InsuranceEmployeeApi,
  InsuranceDoctypeApi,
  CampaignDlrApi
];

const CatalogDeclarationApiList = [
  DeskAdvisorApi,
  DlrFooterApi,
  DlrFloorApi
];

const SaleApiList = [
  LookupApi,
  DealerApi,
  DistrictApi,
  InsuranceApi,
  InsuranceNewEmpApi,
  ProvinceApi,
  GradeApi,
  ModelApi,
  DealerIpConfigApi
];

const WarrantApiList = [
  DlrClaimStatusReportApi,
  DlrDisplayScreenApi,
  DlrUnclaimOrderApi,
  DlrWarrantySearchApi,
  DlrClaimReportApi,
  ClaimDetailApi,
  DlrClaimWatingOrderApi,
  VehicleInfoApi,
  ClaimStatusReportApi,
  WarrantyPartsApi,
  TcodeWarningApi,
  WarrantyFollowUpApi,
  SubletTypeMaintenanceApi,
  ExchangeRateMaintenanceApi,
  WarrantyAssignApi,
  WarrCheckWmiApi,
  VendorMaintenanceApi,
  SoldVehicleMaintenanceApi,
  VehicleRegistrationApi,
  CampaignFollowUpApi
];

const QuotationApiList = [
  StorageQuotationApi,
  EmpCalendarApi,
  RoWshopApi,
  RoWshopActApi,
  TechWshopApi,
  RepairOrderApi,
  RcTypeApi
];

const CustomerStandardizedApiList = [
  StandardizeCustomerApi,
  VehicleApi
];

const CashierApiList = [
  CashierApi,
  InvCusApi,
  InvCusDApi,
  CarNotSettlementOutGateApi,
  CasOutGateApi
];

const AdvisorApiList = [
  UnfWorkAdvisorApi
];

const LexusOrderList = [
  LexusOrderApi,
  LexusPartsReceiveHistoryApi,
  LexusOrderApi
];

const NewInfomationList = [
  NewInfomationApi
];

const SvrMasterApiList = [
  DlrLexusListApi,
  MasterLexusApi
];

const PartsReceiveManualLexusApiList = [
  PartsReceiveManualLexusApi
];

const RepairPlan = [
  RepairPlanApi
];

const ServiceReportApiList = [
  ServiceReportApi
];

const PartsModifyPrepick = [
  PartsModifyPrepickApi
];

@NgModule({
  imports: [
    CoreModule,
    HttpClientModule
  ]
})

export class ApiModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        CampaignFollowUpApi,
        WarrantyFollowUpApi,
        DealerOrderConfigService,
        FunctionLogApi,
        NewInfomationList,
        UserManagementApi,
        BaseApiService,
        SaleApiList,
        CatalogDeclarationApiList,
        CustomerStandardizedApiList,
        QueuingApi,
        CustomerApi,
        CustomerDetailApi,
        CustomerTypeApi,
        AppoinmentApi,
        AuthApi,
        PartsManagementApiList,
        CampaignManagementApi,
        WarrantyTimeSheetApi,
        AuthorizeApi,
        SysUserApi,
        WebSocketService,
        SectionApi,
        SystemFunctionListApi,
        DealerIpApi,
        EngineTypeApi,
        PendingReasonApi,
        VehicleColorApi,
        SystemUserGroupDefinitionApi,
        CampaignOpemApi,
        SrvDRcJobsApi,
        SrvDRcJobsModelsApi,
        SrvDRcRepairPartsApi,
        VinAffectedByCampaignApi,
        ImportVinAffectedByCampaignApi,
        PartsManagementApi,
        DlrFooterApi,
        DeskAdvisorApi,
        DlrFloorApi,
        WarrantApiList,
        CommonApi,
        QuotationApiList,
        CashierApiList,
        AdvisorApiList,
        HomeApi,
        VehicleHistoryApi,
        SvrMasterApiList,
        LexusOrderList,
        PartsReceiveManualLexusApiList,
        RepairPlan,
        ServiceReportApiList,
        BpGroupApi,
        PartsModifyPrepick,
        /// ---------------SALE---------------
        BaseApiService,
        LookupService,
        ProvincesService,
        DealerOrderConfigService,
        UploadService,
        DealerVersionTypeService,
        AuthorizeService,
        BankManagementService,
        CustomerService,
        DealerListService,
        AdvanceReportService,
        ProvincesService,
        InsuranceCompanyService,
        DealerGroupService,
        DistrictListService,
        EmployeeService,
        ContractManagementService,
        YardManagementService,
        YardLocationService,
        ModelListService,
        GradeListService,
        GradeProductionService,
        CbuVehicleInfoService,
        LogisticsCompanyService,
        MeansOfTransportationService,
        ImportService,
        TruckService,
        YardAreaService,
        FormColumnService,
        FormGroupService,
        GroupColumnService,
        AudioManagementService,
        FormService,
        ArrivalLeadtimeService,
        TransportTypeService,
        TransportImageUploaderService,
        ListColumnService,
        InteriorAssignmentService,
        InvoiceLeadTimeService,
        PetrolService,
        InteriorAssignmentService,
        FleetUnitService,
        FleetCustomerService,
        FleetSchemesService,
        FleetSaleApplicationService,
        MoneyDefineService,
        UserColumnService,
        SalesGroupService,
        SalesPersonService,
        SalesTeamSevice,
        LocationOfYardService,
        DealerIpConfigService,
        DlrOrderService,
        NationwideSellingListService,
        NationwideBuyingListService,
        SellBuyMatchingService,
        SwappingVehicleService,
        FilterService,
        DlrVehicleInformationService,
        DealerBalanceService,
        VehicleArrivalService,
        PaymentFollowupService,
        DispatchChangeRequestService,
        ReportService,
        CreateUserService,
        SystemFunctionListService,
        SystemUserGroupDefinitionService,
        VehicleConditionService
      ]
    };
  }
}
