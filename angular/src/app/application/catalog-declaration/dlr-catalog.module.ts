import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {DeskAdvisorComponent} from './desk-advisor/desk-advisor.component';
import {DeskAdvisorModalComponent} from './desk-advisor/desk-advisor-modal/desk-advisor-modal.component';
import {DealerFooterComponent} from './dealer-footer/dealer-footer.component';
import {FollowOrderComponent} from './follow-order/follow-order.component';
import {UnitCatalogComponent} from './unit-catalog/unit-catalog.component';
import {UnitDetailComponent} from './unit-catalog/unit-detail/unit-detail.component';
import {ForecastStockOrderComponent} from './forecast-stock-order/forecast-stock-order.component';
import {ForecastStockOrderModalComponent} from './forecast-stock-order/forecast-stock-order-modal/forecast-stock-order-modal.component';
import {ShowStockOrderModalComponent} from './forecast-stock-order/show-stock-order-modal/show-stock-order-modal.component';
import {RepairCavityComponent} from './repair-cavity/repair-cavity.component';
import {RepairCavityModalComponent} from './repair-cavity/repair-cavity-modal/repair-cavity-modal.component';
import {ParameterOperationAgentComponent} from './parameter-operation-agent/parameter-operation-agent.component';
import {ConfigurationParametersComponent} from './parameter-operation-agent/configuration-parameters/configuration-parameters.component';
import {SupplierCatalogComponent} from './supplier-catalog/supplier-catalog.component';
import {DlrFloorComponent} from './dlr-floor/dlr-floor.component';
import {StaffCatalogComponent} from './staff-catalog/staff-catalog.component';
import {StaffDetailComponent} from './staff-catalog/staff-detail/staff-detail.component';
import {TransferUnitComponent} from './staff-catalog/transfer-unit/transfer-unit.component';
import {FollowOrderUpdateModalComponent} from './follow-order/follow-order-update-modal/follow-order-update-modal.component';
import {UpdateSupplierCatalogModalComponent} from './supplier-catalog/update-supplier-catalog-modal/update-supplier-catalog-modal.component';
import {UpdateDlrFloorModalComponent} from './dlr-floor/update-dlr-floor-modal/update-dlr-floor-modal.component';
import {BankManagementComponent} from './bank-management/bank-management.component';
import {BankManagementModalComponent} from './bank-management/bank-management-modal/bank-management-modal.component';
import {ModelDeclarationComponent} from './model-declaration/model-declaration.component';
import {ModifyCarFamilyModalComponent} from './model-declaration/modify-car-family-modal/modify-car-family-modal.component';
import {ModifyModelCarModalComponent} from './model-declaration/modify-model-car-modal/modify-model-car-modal.component';
import {ModifyJobGroupModalComponent} from './repair-job-management/job-group-declaration/modify-job-group-modal/modify-job-group-modal.component';
import {ProvincesComponent} from './provinces/provinces.component';
import {ProvincesModalComponent} from './provinces/provinces-modal/provinces-modal.component';
import {DistrictListComponent} from './district-list/district-list.component';
import {DistrictListModalComponent} from './district-list/district-list-modal/district-list-modal.component';
import {DealerIpConfigComponent} from './dealer-ip-config/dealer-ip-config.component';
import {DealerIpConfigModalComponent} from './dealer-ip-config/dealer-ip-config-modal/dealer-ip-config-modal.component';
import {RepairJobManagementComponent} from './repair-job-management/repair-job-management.component';
import {RepairJobDetailComponent} from './repair-job-management/repair-job-detail/repair-job-detail.component';
import {JobGroupDeclarationComponent} from './repair-job-management/job-group-declaration/job-group-declaration.component';
import {CopyJobFromGroupJobComponent} from './repair-job-management/job-group-declaration/copy-job-from-group-job/copy-job-from-group-job.component';
import {ApplyJobForCarComponent} from './repair-job-management/apply-job-for-car/apply-job-for-car.component';
import {InsuranceComComponent} from './insurance-com/insurance-com.component';
import {InrComComponent} from './insurance-com/inr-com/inr-com.component';
import {InrFileComponent} from './insurance-com/inr-file/inr-file.component';
import {ModifyInrFileModalComponent} from './insurance-com/inr-file/modify-inr-file-modal/modify-inr-file-modal.component';
import {ModifyInrComModalComponent} from './insurance-com/inr-com/modify-inr-com-modal/modify-inr-com-modal.component';
import {ModifyInrEmpModalComponent} from './insurance-com/inr-com/modify-inr-emp-modal/modify-inr-emp-modal.component';
import {DsManagementComponent} from './ds-management/ds-management.component';
import {DsManagementModalComponent} from './ds-management/ds-management-modal/ds-management-modal.component';
import {CampaignDlrModalComponent} from './campaign-dlr-catalog/update-campaign-modal/campaign-dlr-modal.component';
import {CampaignDlrCatalogComponent} from './campaign-dlr-catalog/campaign-dlr-catalog.component';
import {LaborRateMaintenanceModalComponent} from './labor-rate-maintenance/labor-rate-maintenance-modal/labor-rate-maintenance-modal.component';
import {LaborRateMaintenanceComponent} from './labor-rate-maintenance/labor-rate-maintenance.component';

import {SelectDropDownModule} from 'ngx-select-dropdown';
import {TMSSTabs} from '../../core/constains/tabs';
import {AddUpdateJobModalComponent} from './repair-job-master/add-update-job-modal/add-update-job-modal.component';
import {RepairJobMasterComponent} from './repair-job-master/repair-job-master.component';
import {AddUpdateModalComponent} from './apply-job-for-car-master/add-update-modal/add-update-modal.component';
import {ApplyJobForCarMasterComponent} from './apply-job-for-car-master/apply-job-for-car-master.component';
import {AddUpdateBPModalComponent} from './apply-bp-job-for-car-master/add-update-modal/add-update-modal.component';
import {ApplyBPJobForCarMasterComponent} from './apply-bp-job-for-car-master/apply-bp-job-for-car-master.component';
import {WshopBpGroupComponent} from './wshop-bp-group/wshop-bp-group.component';
import {WshopBpGroupModalComponent} from './wshop-bp-group/wshop-bp-group-modal/wshop-bp-group-modal.component';

const Components = [
  BankManagementComponent,
  BankManagementModalComponent,
  UnitCatalogComponent,
  UnitDetailComponent,
  DeskAdvisorComponent,
  DeskAdvisorModalComponent,
  DealerFooterComponent,
  FollowOrderComponent,
  FollowOrderUpdateModalComponent,
  RepairCavityComponent,
  RepairCavityModalComponent,
  ForecastStockOrderComponent,
  ForecastStockOrderModalComponent,
  ShowStockOrderModalComponent,
  ParameterOperationAgentComponent,
  ConfigurationParametersComponent,
  SupplierCatalogComponent,
  UpdateSupplierCatalogModalComponent,
  DlrFloorComponent,
  UpdateDlrFloorModalComponent,
  StaffCatalogComponent,
  StaffDetailComponent,
  TransferUnitComponent,
  ModelDeclarationComponent,
  ProvincesComponent,
  DistrictListComponent,
  DealerIpConfigComponent,
  RepairJobManagementComponent,
  InsuranceComComponent,
  InrComComponent,
  ModifyInrComModalComponent,
  ModifyInrEmpModalComponent,
  InrFileComponent,
  ModifyInrFileModalComponent,
  DsManagementModalComponent,
  DsManagementComponent,
  CampaignDlrModalComponent,
  CampaignDlrCatalogComponent,
  LaborRateMaintenanceComponent,
  LaborRateMaintenanceModalComponent,
  AddUpdateJobModalComponent,
  RepairJobMasterComponent,
  AddUpdateModalComponent,
  ApplyJobForCarMasterComponent,
  AddUpdateBPModalComponent,
  ApplyBPJobForCarMasterComponent,
  WshopBpGroupComponent,
  WshopBpGroupModalComponent
];

const EntryComponents = [
  BankManagementComponent,
  UnitCatalogComponent,
  DeskAdvisorComponent,
  DealerFooterComponent,
  FollowOrderComponent,
  RepairCavityComponent,
  ForecastStockOrderComponent,
  ParameterOperationAgentComponent,
  SupplierCatalogComponent,
  DlrFloorComponent,
  StaffCatalogComponent,
  ModelDeclarationComponent,
  ProvincesComponent,
  DistrictListComponent,
  DealerIpConfigComponent,
  RepairJobManagementComponent,
  InsuranceComComponent,
  DsManagementComponent,
  CampaignDlrCatalogComponent,
  LaborRateMaintenanceComponent,
  RepairJobMasterComponent,
  ApplyJobForCarMasterComponent,
  ApplyBPJobForCarMasterComponent,
  WshopBpGroupComponent,
];

const map = {
  [TMSSTabs.provinceList]: ProvincesComponent,
  [TMSSTabs.districtList]: DistrictListComponent,
  [TMSSTabs.unitCatalog]: UnitCatalogComponent,
  [TMSSTabs.staffCatalog]: StaffCatalogComponent,
  [TMSSTabs.repairCavity]: RepairCavityComponent,
  [TMSSTabs.parameterOperationAgent]: ParameterOperationAgentComponent,
  [TMSSTabs.modelDeclaration]: ModelDeclarationComponent,
  [TMSSTabs.generalRepair]: RepairJobManagementComponent,
  [TMSSTabs.supplierManagement]: SupplierCatalogComponent,
  [TMSSTabs.insuranceCompany]: InsuranceComComponent,
  [TMSSTabs.bankCatalog]: BankManagementComponent,
  [TMSSTabs.dealerFooter]: DealerFooterComponent,
  [TMSSTabs.deskAdvisor]: DeskAdvisorComponent,
  [TMSSTabs.dlrFloor]: DlrFloorComponent,
  [TMSSTabs.forecastOrder]: ForecastStockOrderComponent,
  [TMSSTabs.followOrder]: FollowOrderComponent,
  [TMSSTabs.dsManagement]: DsManagementComponent,
  [TMSSTabs.campaignDlr]: CampaignDlrCatalogComponent,
  [TMSSTabs.laborRateMaintenance]: LaborRateMaintenanceComponent,
  [TMSSTabs.dealerIpConfig]: DealerIpConfigComponent,
  [TMSSTabs.repairJobMaster]: RepairJobMasterComponent,
  [TMSSTabs.applyJobForCarMaster]: ApplyJobForCarMasterComponent,
  [TMSSTabs.applyBPJobForCarMaster]: ApplyBPJobForCarMasterComponent,
  [TMSSTabs.wshopBpGroup]: WshopBpGroupComponent,
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    SelectDropDownModule
  ],
  declarations: [
    Components,
    ModifyCarFamilyModalComponent,
    ModifyModelCarModalComponent,
    ModifyJobGroupModalComponent,
    ProvincesModalComponent,
    DistrictListModalComponent,
    DealerIpConfigModalComponent,
    RepairJobDetailComponent,
    JobGroupDeclarationComponent,
    CopyJobFromGroupJobComponent,
    ApplyJobForCarComponent,
    DsManagementComponent,
    DsManagementModalComponent,
  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class DlrCatalogModule {
  static getComponent(key) {
    return map[key];
  }
}
