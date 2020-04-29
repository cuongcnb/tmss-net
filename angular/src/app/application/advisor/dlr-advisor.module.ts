import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerInfoComponent} from './customer-info/customer-info.component';
import {CustomerWaitingComponent} from './customer-info/customer-waiting/customer-waiting.component';
import {CarQueuingTicketComponent} from './customer-info/car-queuing-ticket/car-queuing-ticket.component';
import {RepairHistoryComponent} from './customer-info/repair-history/repair-history.component';
import {FollowingByRoComponent} from './customer-info/repair-history/following-by-ro/following-by-ro.component';
import {FollowingByWorkComponent} from './customer-info/repair-history/following-by-work/following-by-work.component';
import {FilterBeforePrintComponent} from './customer-info/repair-history/filter-before-print/filter-before-print.component';
import {BookingComponent} from './booking/booking.component';
import {SearchingOfBookingComponent} from './booking/searching-of-booking/searching-of-booking.component';
import {CustomerInfoOfBookingComponent} from './booking/customer-info-of-booking/customer-info-of-booking.component';
import {CarInfoOfBookingComponent} from './booking/car-info-of-booking/car-info-of-booking.component';
import {RequiredInfoOfBookingComponent} from './booking/required-info-of-booking/required-info-of-booking.component';
import {StandardizeInfoModalComponent} from './standardize-customer-info/standarize-info-modal/standardize-info-modal.component';
import {StandardizeCustomerInfoComponent} from './standardize-customer-info/standardize-customer-info.component';
import {VehiclesInfoComponent} from './standardize-customer-info/vehicles-info/vehicles-info.component';
import {DetailCusInfoComponent} from './standardize-customer-info/detail-cus-info/detail-cus-info.component';
import {VehicleInfoTabModalComponent} from './standardize-customer-info/standarize-info-modal/vehicle-info-tab-modal/vehicle-info-tab-modal.component';
import {LSCInfoTabModalComponent} from './standardize-customer-info/standarize-info-modal/lsc-info-tab-modal/lsc-info-tab-modal.component';
import {RetailPartInfoTabModalComponent} from './standardize-customer-info/standarize-info-modal/retail-part-info-tab-modal/retail-part-info-tab-modal.component';
import {CusInfoDetailTabModalComponent} from './standardize-customer-info/standarize-info-modal/cus-info-detail-tab-modal/cus-info-detail-tab-modal.component';
import {StandardizeCusInfoDetailModalComponent} from './standardize-customer-info/detail-cus-info/standardize-cus-info-detail-modal/standardize-cus-info-detail-modal.component';
import {ProposalInBookingComponent} from './booking/proposal-in-booking/proposal-in-booking.component';
import {ProposalComponent} from './customer-info/proposal/proposal.component';
import {CusInfoOfProposalComponent} from './customer-info/proposal/cus-info-of-proposal/cus-info-of-proposal.component';
import {CarInfoOfProposalComponent} from './customer-info/proposal/car-info-of-proposal/car-info-of-proposal.component';
import {RepairOfProposalComponent} from './customer-info/proposal/repair-of-proposal/repair-of-proposal.component';
import {GeneralRepairOfProposalComponent} from './customer-info/proposal/repair-of-proposal/general-repair-of-proposal/general-repair-of-proposal.component';
import {FixOfProposalComponent} from './customer-info/proposal/repair-of-proposal/fix-of-proposal/fix-of-proposal.component';
import {InsuranceOfProposalComponent} from './customer-info/proposal/repair-of-proposal/insurance-of-proposal/insurance-of-proposal.component';
import {DongSonOfProposalComponent} from './customer-info/proposal/repair-of-proposal/dong-son-of-proposal/dong-son-of-proposal.component';
import {AccessoryOfProposalComponent} from './customer-info/proposal/accessory-of-proposal/accessory-of-proposal.component';
import {WorkPlanOfProposalComponent} from './customer-info/proposal/work-plan-of-proposal/work-plan-of-proposal.component';
import {StorageQuotationComponent} from './storage-quotation/storage-quotation.component';
import {QuotationAccountComponent} from './quotation-account/quotation-account.component';
import {ChangeCustomerInformationComponent} from './change-customer-information/change-customer-information.component';
import {WorkGroupListModalComponent} from './customer-info/proposal/repair-of-proposal/work-group-list-modal/work-group-list-modal.component';
import {RepairProfileComponent} from './repair-profile/repair-profile.component';
import {OrderPrintModalComponent} from './repair-profile/order-print-modal/order-print-modal.component';
import {UnfWorkDlrAdvisorComponent} from './unf-work-dlr-advisor/unf-work-dlr-advisor.component';
import {AppointmenntInDayTabComponent} from './unf-work-dlr-advisor/appointmennt-in-day-tab/appointmennt-in-day-tab.component';
import {UnfinishWorkTabComponent} from './unf-work-dlr-advisor/unfinish-work-tab/unfinish-work-tab.component';
import {JobTabComponent} from './unf-work-dlr-advisor/job-tab/job-tab.component';
import {PartTabComponent} from './unf-work-dlr-advisor/part-tab/part-tab.component';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {CustomerComponent} from './customer-info/main-page/customer/customer.component';
import {VehicleComponent} from './customer-info/main-page/vehicle/vehicle.component';
import {CustomerReferComponent} from './customer-info/main-page/customer-refer/customer-refer.component';
import {HistoryComponent} from './customer-info/main-page/history/history.component';
import {CrmActionComponent} from './customer-info/main-page/crm-action/crm-action.component';
import {VehicleSearchComponent} from './customer-info/main-page/vehicle-search/vehicle-search.component';
import {WorkModifyComponent} from './customer-info/proposal/repair-of-proposal/general-repair-of-proposal/work-modify/work-modify.component';
import {AccessoryModifyComponent} from './customer-info/proposal/accessory-of-proposal/accessory-modify/accessory-modify.component';
import {ProposalPrintComponent} from './customer-info/proposal/proposal-print/proposal-print.component';
import {ProposalPrintSavingComponent} from './customer-info/proposal/proposal-print/proposal-print-saving/proposal-print-saving.component';
import {AccessoryDetailComponent} from './customer-info/proposal/accessory-of-proposal/accessory-detail/accessory-detail.component';
import {WorkingPlanComponent} from './customer-info/proposal/work-plan-of-proposal/working-plan/working-plan.component';
import {WorkNeedFastComponent} from './customer-info/proposal/proposal-modal/work-need-fast/work-need-fast.component';
import {WorkIncurredComponent} from './customer-info/proposal/proposal-modal/work-incurred/work-incurred.component';
import {PartBookingDetailComponent} from './booking/required-info-of-booking/part-booking-detail/part-booking-detail.component';
import {BoOrderFollowupCvdvComponent} from './bo-order-followup-cvdv/bo-order-followup-cvdv.component';
import {BoFollowupCvdvDetailModalComponent} from './bo-order-followup-cvdv/bo-followup-cvdv-detail-modal/bo-followup-cvdv-detail-modal.component';
import {BoFollowupCvdvEditModalComponent} from './bo-order-followup-cvdv/bo-followup-cvdv-edit-modal/bo-followup-cvdv-edit-modal.component';
import {StandardizeChoosingDataComponent} from './standardize-customer-info/standardize-choosing-data/standardize-choosing-data.component';
import {ViewProposalComponent} from './storage-quotation/view-proposal/view-proposal.component';
import {RepairProposalComponent} from './storage-quotation/view-proposal/repair-of-proposal/repair-proposal.component';
import {GeneralRepairProposalComponent} from './storage-quotation/view-proposal/repair-of-proposal/general-repair-proposal/general-repair-proposal.component';
import {FixProposalComponent} from './storage-quotation/view-proposal/repair-of-proposal/fix-proposal/fix-proposal.component';
import {AccessoryProposalComponent} from './storage-quotation/view-proposal/accessory-proposal/accessory-proposal.component';
import {WorkPlanProposalComponent} from './storage-quotation/view-proposal/work-plan-proposal/work-plan-proposal.component';
import {CusInfoProposalComponent} from './storage-quotation/view-proposal/cus-info-proposal/cus-info-proposal.component';
import {CarInfoProposalComponent} from './storage-quotation/view-proposal/car-info-proposal/car-info-proposal.component';
import {CampaignDlrComponent} from './customer-info/campaign-dlr/campaign-dlr.component';
import {AccessoryDiscountComponent} from './customer-info/proposal/accessory-of-proposal/accessory-discount/accessory-discount.component';
import {PartFromBookingComponent} from './customer-info/proposal/accessory-of-proposal/part-from-booking/part-from-booking.component';
import {DongSonProposalComponent} from './storage-quotation/view-proposal/repair-of-proposal/dong-son-proposal/dong-son-proposal.component';
import {StorageModalComponent} from './customer-info/proposal/proposal-modal/storage -modal/storage-modal.component';
import {PartFromBookingDetailComponent} from './customer-info/proposal/accessory-of-proposal/part-from-booking-detail/part-from-booking-detail.component';
import {StorageJobPackageComponent} from './storage-job-package/storage-job-package.component';
import {DetailJobPackageComponent} from './storage-job-package/detail-job-package/detail-job-package.component';
import {AddStorageJobPackageComponent} from './customer-info/proposal/add-storage-job-package/add-storage-job-package.component';
import {AccessoryJobPackageComponent} from './storage-job-package/detail-job-package/accessory-job-package/accessory-job-package.component';
import {GeneralRepairStorageJobComponent} from './storage-job-package/detail-job-package/general-repair-storage-job/general-repair-storage-job.component';
import {DongSonJobPackageComponent} from './storage-job-package/detail-job-package/dong-son-job-package/dong-son-job-package.component';
import {ActiveCrComponent} from './customer-info/main-page/active-CR/active-cr.component';
import {RecentlyPartPriceComponent} from './customer-info/proposal/accessory-of-proposal/recently-part-price/recently-part-price.component';
import {TMSSTabs} from '../../core/constains/tabs';
import {MoveRoSettlementToRepairComponent} from './move-ro-settelemt-to-repair/move-ro-settlement-to-repair.component';
import {KeyboardShortcutsModule} from 'ng-keyboard-shortcuts';

// @ts-ignore
const Components = [
  StorageJobPackageComponent,
  CustomerInfoComponent,
  CustomerWaitingComponent,
  CarQueuingTicketComponent,
  RepairHistoryComponent,
  FollowingByRoComponent,
  FollowingByWorkComponent,
  FilterBeforePrintComponent,
  BookingComponent,
  SearchingOfBookingComponent,
  CustomerInfoOfBookingComponent,
  CarInfoOfBookingComponent,
  RequiredInfoOfBookingComponent,
  ProposalInBookingComponent,
  StandardizeInfoModalComponent,
  StandardizeCustomerInfoComponent,
  PartBookingDetailComponent,
  VehiclesInfoComponent,
  AccessoryModifyComponent,
  DetailCusInfoComponent,
  VehicleInfoTabModalComponent,
  LSCInfoTabModalComponent,
  RetailPartInfoTabModalComponent,
  CusInfoDetailTabModalComponent,
  StandardizeCusInfoDetailModalComponent,
  ProposalComponent,
  CusInfoOfProposalComponent,
  CarInfoOfProposalComponent,
  RepairOfProposalComponent,
  StorageModalComponent,
  PartFromBookingDetailComponent,
  GeneralRepairOfProposalComponent,
  FixOfProposalComponent,
  InsuranceOfProposalComponent,
  DongSonOfProposalComponent,
  AccessoryOfProposalComponent,
  WorkPlanOfProposalComponent,
  StorageQuotationComponent,
  QuotationAccountComponent,
  ChangeCustomerInformationComponent,
  HistoryComponent,
  CrmActionComponent,
  RepairProfileComponent,
  CustomerComponent,
  WorkGroupListModalComponent,
  OrderPrintModalComponent,
  VehicleSearchComponent,
  WorkModifyComponent,
  UnfWorkDlrAdvisorComponent,
  AppointmenntInDayTabComponent,
  CustomerReferComponent,
  UnfinishWorkTabComponent,
  JobTabComponent,
  PartTabComponent,
  BoOrderFollowupCvdvComponent,
  BoFollowupCvdvDetailModalComponent,
  BoFollowupCvdvEditModalComponent,
  ViewProposalComponent,
  CampaignDlrComponent,
  AccessoryDiscountComponent,
  StandardizeChoosingDataComponent,
  PartFromBookingComponent,
  DongSonProposalComponent,
  DetailJobPackageComponent,
  AddStorageJobPackageComponent,
  AccessoryJobPackageComponent,
  DongSonJobPackageComponent,
  GeneralRepairStorageJobComponent,
  ActiveCrComponent,
  RecentlyPartPriceComponent,
  MoveRoSettlementToRepairComponent
];

const entryComponent = [
  WorkGroupListModalComponent,
  VehicleComponent,
  BookingComponent,
  CustomerInfoComponent,
  ProposalComponent,
  StandardizeCustomerInfoComponent,
  ChangeCustomerInformationComponent,
  UnfWorkDlrAdvisorComponent,
  RepairProfileComponent,
  QuotationAccountComponent,
  StorageQuotationComponent,
  BoOrderFollowupCvdvComponent,
  StorageJobPackageComponent,
  ViewProposalComponent,
  MoveRoSettlementToRepairComponent
];

const map = {
  [TMSSTabs.booking]: BookingComponent,
  [TMSSTabs.proposal]: ProposalComponent,
  [TMSSTabs.customerInfo]: CustomerInfoComponent,
  [TMSSTabs.standardizeCustomerInfo]: StandardizeCustomerInfoComponent,
  [TMSSTabs.changeCustomerInfo]: ChangeCustomerInformationComponent,
  [TMSSTabs.unfWorkDlrAdv]: UnfWorkDlrAdvisorComponent,
  [TMSSTabs.repairProfile]: RepairProfileComponent,
  [TMSSTabs.quotationAccount]: QuotationAccountComponent,
  [TMSSTabs.storageQuotation]: StorageQuotationComponent,
  [TMSSTabs.storageJobPackage]: StorageJobPackageComponent,
  [TMSSTabs.viewProposal]: ViewProposalComponent,
  [TMSSTabs.dlrBoPartsFollowupCvdv]: BoOrderFollowupCvdvComponent,
  [TMSSTabs.moveRoSettlementToRepair]: MoveRoSettlementToRepairComponent
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    KeyboardShortcutsModule.forRoot(),
  ],
  declarations: [
    Components,
    entryComponent,
    ProposalPrintComponent,
    ProposalPrintSavingComponent,
    AccessoryDetailComponent,
    WorkingPlanComponent,
    WorkNeedFastComponent,
    WorkIncurredComponent,
    RepairProposalComponent,
    GeneralRepairProposalComponent,
    FixProposalComponent,
    AccessoryProposalComponent,
    WorkPlanProposalComponent,
    CusInfoProposalComponent,
    CarInfoProposalComponent,
    StorageJobPackageComponent,
    DetailJobPackageComponent,
    AddStorageJobPackageComponent,
    AccessoryJobPackageComponent,
    GeneralRepairStorageJobComponent,
    DongSonJobPackageComponent
  ],
  exports: [
    Components
  ],
  entryComponents: [
    entryComponent
  ]
})
export class DlrAdvisorModule {
  static getComponent(key) {
    if (key.startsWith(TMSSTabs.proposal) && !key.startsWith(TMSSTabs.quotationAccount)) {
      return map[TMSSTabs.proposal];
    }
    return map[key];
  }
}
