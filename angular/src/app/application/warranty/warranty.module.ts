import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {CampaignManagementComponent} from './campaign-management/campaign-management.component';
import {UpdateCampaignModalComponent} from './campaign-management/update-campaign-modal/update-campaign-modal.component';
import {WarrantyInformationComponent} from '../warranty-new/warranty-information/warranty-information.component';
import {VinDetailModalComponent} from '../warranty-new/warranty-information/vin-detail-modal/vin-detail-modal.component';
import {ClaimStatusReportComponent} from '../warranty-new/claim-status-report/claim-status-report.component';
import {SearchRoModalComponent} from '../warranty-new/claim-status-report/search-ro-modal/search-ro-modal.component';
import {ClaimDetailComponent} from '../warranty-new/claim-status-report/claim-detail/claim-detail.component';
import {TCodeComponent} from '../warranty-new/claim-status-report/claim-detail/t-code/t-code.component';
import {LaborComponent} from '../warranty-new/claim-status-report/claim-detail/labor/labor.component';
import {SubletComponent} from '../warranty-new/claim-status-report/claim-detail/sublet/sublet.component';
import {PartsComponent} from '../warranty-new/claim-status-report/claim-detail/parts/parts.component';
import {ReasonCodeComponent} from '../warranty-new/claim-status-report/claim-detail/reason-code/reason-code.component';
import {ClaimDetailViewComponent} from '../warranty-new/claim-status-report/claim-detail-view/claim-detail-view.component';
import {RepairJobHistoryComponent} from '../warranty-new/claim-status-report/repair-job-history/repair-job-history.component';
import {WarrantyTimeSheetDeclareComponent} from './warranty-time-sheet-declare/warranty-time-sheet-declare.component';
import {ModifyWarrantyTimeSheetComponent} from './warranty-time-sheet-declare/modify-warranty-time-sheet/modify-warranty-time-sheet.component';
import {TMSSTabs} from '../../core/constains/tabs';
import {WarrantyFollowUpComponent} from '../warranty-new/warranty-follow-up/warranty-follow-up.component';
import {WarrantyAssignComponent} from '../warranty-new/warranty-assign/warranty-assign.component';
import {UpdateKmComponent} from '../warranty-new/update-km/update-km.component';
import {UpdateWarrantyFollowUpModalComponent} from '../warranty-new/warranty-follow-up/update-warranty-follow-up-modal/update-warranty-follow-up-modal';
import {UpdateKmModalComponent} from '../warranty-new/update-km/update-km-modal/update-km-modal';
import {ExchangeRateMaintenanceComponent} from '../warranty-new/exchange-rate-maintenance/exchange-rate-maintenance.component';
import {T1T2T3WarningListComponent} from '../warranty-new/t1-t2-t3-warning-list/t1-t2-t3-warning-list.component';
import {SubletTypeMaintenanceComponent} from '../warranty-new/sublet-type-maintenance/sublet-type-maintenance.component';
import {UpdateTCodeWarningModalComponent} from '../warranty-new/t1-t2-t3-warning-list/update-t-code-warning-modal/update-t-code-warning-modal.component';
import {UpdateExchangeRateMaintenanceModalComponent} from '../warranty-new/exchange-rate-maintenance/update-exchange-rate-maintenance-modal/update-exchange-rate-maintenance-modal.component';
import {UpdateWarrantyAssignModalComponent} from '../warranty-new/warranty-assign/update-warranty-assign-modal/update-warranty-assign-modal.component';
import {UpdateSubletTypeMaintenanceModalComponent} from '../warranty-new/sublet-type-maintenance/update-sublet-type-maintenance-modal/update-sublet-type-maintenance-modal.component';
import {WarrantyCheckWmiComponent} from '../warranty-new/warranty-check-wmi/warranty-check-wmi.component';
import {UpdateWarrantyCheckWmiModalComponent} from '../warranty-new/warranty-check-wmi/update-warranty-check-wmi-modal/update-warranty-check-wmi-modal.component';
import {VendorMaintenanceComponent} from '../warranty-new/vendor-maintenance/vendor-maintenance.component';
import {UpdateVendorMaintenanceModalComponent} from '../warranty-new/vendor-maintenance/update-vendor-maintenance-modal/update-vendor-maintenance-modal.component';
import {WarrantyCheckWmiImportModalComponent} from '../warranty-new/warranty-check-wmi/warranty-check-wmi-import-modal/warranty-check-wmi-import-modal.component';
import {VehicleRegistrationComponent} from '../warranty-new/vehicle-registration/vehicle-registration.component';
import {SoldVehicleMaintenanceComponent} from '../warranty-new/sold-vehicle-maintenance/sold-vehicle-maintenance.component';
import {VehicleInfoComponent} from '../warranty-new/vehicle-registration/vehicle-info/vehicle-info.component';
import {CustomerInfoComponent} from '../warranty-new/vehicle-registration/customer-info/customer-info.component';
import {RelativeInfoComponent} from '../warranty-new/vehicle-registration/relative-info/relative-info.component';
import {UpdateSoldVehicleMaintenanceModalComponent} from "../warranty-new/sold-vehicle-maintenance/update-sold-vehicle-maintenance-modal/update-sold-vehicle-maintenance-modal.component";
import { CampaignFollowRemindComponent } from '../warranty-new/campaign-follow-remind/campaign-follow-remind.component';
import { CampaignFollowUpComponent } from '../warranty-new/campaign-follow-up/campaign-follow-up.component';
import { CampaignVehCompleteComponent } from '../warranty-new/campaign-veh-complete/campaign-veh-complete.component';


const Components = [
  CampaignManagementComponent,
  UpdateCampaignModalComponent,
  WarrantyInformationComponent,
  VinDetailModalComponent,
  ClaimStatusReportComponent,
  SearchRoModalComponent,
  ClaimDetailComponent,
  LaborComponent,
  TCodeComponent,
  SubletComponent,
  PartsComponent,
  ReasonCodeComponent,
  ClaimDetailViewComponent,
  RepairJobHistoryComponent,
  WarrantyTimeSheetDeclareComponent,
  ModifyWarrantyTimeSheetComponent,
  WarrantyFollowUpComponent,
  WarrantyAssignComponent,
  UpdateKmComponent,
  UpdateKmModalComponent,
  ExchangeRateMaintenanceComponent,
  T1T2T3WarningListComponent,
  SubletTypeMaintenanceComponent,
  UpdateTCodeWarningModalComponent,
  UpdateExchangeRateMaintenanceModalComponent,
  UpdateWarrantyAssignModalComponent,
  UpdateWarrantyFollowUpModalComponent,
  UpdateSubletTypeMaintenanceModalComponent,
  UpdateWarrantyCheckWmiModalComponent,
  WarrantyCheckWmiComponent,
  VendorMaintenanceComponent,
  UpdateVendorMaintenanceModalComponent,
  WarrantyCheckWmiImportModalComponent,
  VehicleRegistrationComponent,
  SoldVehicleMaintenanceComponent,
  VehicleInfoComponent,
  CustomerInfoComponent,
  RelativeInfoComponent,
  UpdateSoldVehicleMaintenanceModalComponent,
  CampaignVehCompleteComponent,
  CampaignFollowRemindComponent,
  CampaignFollowUpComponent,
];

const EntryComponents = [
  CampaignManagementComponent,
  WarrantyInformationComponent,
  ClaimStatusReportComponent,
  WarrantyTimeSheetDeclareComponent,
  WarrantyFollowUpComponent,
  WarrantyAssignComponent,
  UpdateKmComponent,
  ExchangeRateMaintenanceComponent,
  T1T2T3WarningListComponent,
  SubletTypeMaintenanceComponent,
  WarrantyCheckWmiComponent,
  VendorMaintenanceComponent,
  VehicleRegistrationComponent,
  SoldVehicleMaintenanceComponent,
  CampaignVehCompleteComponent,
  CampaignFollowRemindComponent,
  CampaignFollowUpComponent,
];

const map = {
  [TMSSTabs.campaignManagementTmv]: CampaignManagementComponent,
  [TMSSTabs.warrantyInformation]: WarrantyInformationComponent,
  [TMSSTabs.claimStatusReport]: ClaimStatusReportComponent,
  [TMSSTabs.warrantyTimeSheetDeclare]: WarrantyTimeSheetDeclareComponent,
  [TMSSTabs.warrantyFollowUp]: WarrantyFollowUpComponent,
  [TMSSTabs.warrantyAssign]: WarrantyAssignComponent,
  [TMSSTabs.updateKm]: UpdateKmComponent,
  [TMSSTabs.exchangeRateMaintenance]: ExchangeRateMaintenanceComponent,
  [TMSSTabs.t1t2t3WarningList]: T1T2T3WarningListComponent,
  [TMSSTabs.subletTypeMaintenance]: SubletTypeMaintenanceComponent,
  [TMSSTabs.warrantyCheckWmi]: WarrantyCheckWmiComponent,
  [TMSSTabs.vendorMaintenance]: VendorMaintenanceComponent,
  [TMSSTabs.soldVehicleMaintenance]: SoldVehicleMaintenanceComponent,
  [TMSSTabs.warrantyVehicleRegistration]: VehicleRegistrationComponent,
  [TMSSTabs.campaignVehComplete]: CampaignVehCompleteComponent,
  [TMSSTabs.campaignFollowRemind]: CampaignFollowRemindComponent,
  [TMSSTabs.campaignFollowUp]: CampaignFollowUpComponent
};

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule
  ],
  declarations: [
    Components
  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class WarrantyModule {
  static getComponent(key) {
    return map[key];
  }
}
