import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoPartsOrderComponent} from './bo-parts-order/bo-parts-order.component';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {BoOrderFollowupComponent} from './bo-order-followup/bo-order-followup.component';
import {BoOrderFollowupDetailsComponent} from './bo-order-followup/bo-order-followup-details/bo-order-followup-details.component';
import {BoPartsDetailOrderComponent} from './bo-parts-order/bo-parts-detail-order/bo-parts-detail-order.component';
import {RoLackOfPartsExportComponent} from './ro-lack-of-parts-export/ro-lack-of-parts-export.component';
import {PartsOrderForStoringComponent} from './parts-order-for-storing/parts-order-for-storing.component';
import {StoringPartsOrderDetailComponent} from './parts-order-for-storing/storing-parts-order-detail/storing-parts-order-detail.component';
import {PartsExportComponent} from './parts-export/parts-export.component';
import {PrepickListComponent} from './parts-export/export-detail-and-pre-pick-tab/prepick-list/prepick-list.component';
import {PartsExportShippingHistoryComponent} from './parts-export/export-detail-and-pre-pick-tab/parts-export-shipping-history/parts-export-shipping-history.component';
import {PartsRetailComponent} from './parts-retail/parts-retail.component';
import {PartsLookupInfoComponent} from './parts-lookup-info/parts-lookup-info.component';
import {PartsLookupInfoCheckboxComponent} from './parts-lookup-info/parts-lookup-info-checkbox/parts-lookup-info-checkbox.component';
import {PartsLookupInfoHistoryCheckboxComponent} from './parts-lookup-info/parts-lookup-info-history-checkbox/parts-lookup-info-history-checkbox.component';
import {PartsManualOrderComponent} from './parts-manual-order/parts-manual-order.component';
import {NewManualOrderModalComponent} from './parts-manual-order/new-manual-order-modal/new-manual-order-modal.component';
import {SelectPackOfPartsModalComponent} from './parts-manual-order/select-pack-of-parts-modal/select-pack-of-parts-modal.component';
import {PartsInStockAdjustmentComponent} from './parts-in-stock-adjustment/parts-in-stock-adjustment.component';
import {PartsSpecialOrderComponent} from './parts-special-order/parts-special-order.component';
import {NewSpecialOrderModalComponent} from './parts-special-order/new-special-order-modal/new-special-order-modal.component';
import {PartsInStockStatusComponent} from './parts-in-stock-status/parts-in-stock-status.component';
import {PartsInfoManagementComponent} from './parts-info-management/parts-info-management.component';
import {ImportPartsInfoModalComponent} from './parts-info-management/import-parts-info-modal/import-parts-info-modal.component';
import {PartsCancelOrderRequestComponent} from './parts-cancel-order-request/parts-cancel-order-request.component';
import {PartsOrderPrePlanComponent} from './parts-order-pre-plan/parts-order-pre-plan.component';
import {NewOrderPrePlanModalComponent} from './parts-order-pre-plan/new-order-pre-plan-modal/new-order-pre-plan-modal.component';
import {PartsReceiveAutomaticComponent} from './parts-receive-automatic/parts-receive-automatic.component';
import {PartsReceiveDetailModalComponent} from './parts-receive-automatic/parts-receive-detail-modal/parts-receive-detail-modal.component';
import {DeliveryOrderModalComponent} from './parts-receive-automatic/delivery-order-modal/delivery-order-modal.component';
import {EditPartManagementInfoModalComponent} from './parts-info-management/edit-part-management-info-modal/edit-part-management-info-modal.component';
import {PartsReceiveManualComponent} from './parts-receive-manual/parts-receive-manual.component';
import {PartsReceiveManualDetailModalComponent} from './parts-receive-manual/parts-receive-manual-detail-modal/parts-receive-manual-detail-modal.component';
import {PartsUpcommingInfoComponent} from './parts-upcomming-info/parts-upcomming-info.component';
import {PartsRetailDetailComponent} from './parts-retail/parts-retail-detail/parts-retail-detail.component';
import {PartsRetailNewOrderComponent} from './parts-retail/parts-retail-new-order/parts-retail-new-order.component';
import {PartsExportSingleSlipModalComponent} from './parts-export/parts-export-single-slip-modal/parts-export-single-slip-modal.component';
import {PartsExportViewSlipModalComponent} from './parts-export/parts-export-view-slip-modal/parts-export-view-slip-modal.component';
import {PartSelectPrintFormatModalComponent} from './parts-export/part-select-print-format-modal/part-select-print-format-modal.component';
import {PartsExportLackLookupComponent} from './parts-export-lack-lookup/parts-export-lack-lookup.component';
import {ListRoExportLackComponent} from './parts-export-lack-lookup/list-ro-export-lack/list-ro-export-lack.component';
import {ListCommandBoNoExportComponent} from './parts-export-lack-lookup/list-command-bo-no-export/list-command-bo-no-export.component';
import {PartsCancelTrackingComponent} from './parts-cancel-tracking/parts-cancel-tracking.component';
import {DeadStockPartForSaleComponent} from './dead-stock-part-for-sale/dead-stock-part-for-sale.component';
import {DeadStockPartSearchingComponent} from './dead-stock-part-searching/dead-stock-part-searching.component';
import {BoOrderSlipModalComponent} from './bo-parts-order/bo-order-slip-modal/bo-order-slip-modal.component';
import {SendClaimComponent} from './send-claim/send-claim.component';
import {SendClaimModalComponent} from './send-claim/send-claim-modal/send-claim-modal.component';
import {ApprovalClaimModalComponent} from './send-claim/approval-claim-modal/approval-claim-modal.component';
import {MipCalculateComponent} from './mip-calculate/mip-calculate.component';
import {ApprovalClaimComponent} from './send-claim/approval-claim/approval-claim.component';
import {PartsCheckPriceCodeComponent} from './parts-check-price-code/parts-check-price-code.component';
import {PartsRepairPositionPrepickComponent} from './parts-repair-position-prepick/parts-repair-position-prepick.component';
import {PartsOnhandOrderFollowupComponent} from './parts-onhand-order-followup/parts-onhand-order-followup.component';
import {ShippingModalComponent} from './parts-export-lack-lookup/shipping-modal/shipping-modal.component';
import {NewCheckPriceCodeModalComponent} from './parts-check-price-code/new-check-price-code-modal/new-check-price-code-modal.component';
import {PartsReceiveHistoryComponent} from './parts-receive-history/parts-receive-history.component';
import {BoOrderFollowupNvptComponent} from './bo-order-followup-nvpt/bo-order-followup-nvpt.component';
import {BoFollowupNvptEditModalComponent} from './bo-order-followup-nvpt/bo-followup-nvpt-edit-modal/bo-followup-nvpt-edit-modal.component';
import {MipImportComponent} from './mip-import/mip-import.component';
import {PartShippingHistoryComponent} from './part-shipping-history/part-shipping-history.component';
import {PartShippingDetailModalComponent} from './part-shipping-history/part-shipping-detail-modal/part-shipping-detail-modal.component';
import {OrderForLexusPartComponent} from './order-for-lexus-part/order-for-lexus-part.component';
import {PartsNonLexusOrderLexusComponent} from './parts-non-lexus-order-lexus/parts-non-lexus-order-lexus.component';
import {PartsManualCheckingModalComponent} from './parts-manual-order/parts-manual-checking-modal/parts-manual-checking-modal.component';
import {PartsSpecialCheckingModalComponent} from './parts-special-order/parts-special-checking-modal/parts-special-checking-modal.component';
import {PartsPrePlanCheckingModalComponent} from './parts-order-pre-plan/parts-pre-plan-checking-modal/parts-pre-plan-checking-modal.component';
import {PartsRetailCheckingModalComponent} from './parts-retail/parts-retail-checking-modal/parts-retail-checking-modal.component';
import {
  PartNonLexusOrderLexusOrderTmvModalComponent
} from './parts-non-lexus-order-lexus/part-non-lexus-order-lexus-order-tmv-modal/part-non-lexus-order-lexus-order-tmv-modal.component';
import {PartsManagementService} from './parts-management.service';
import {SendClaimAttachedFileModalComponent} from './send-claim/send-claim-attached-file-modal/send-claim-attached-file-modal.component';
import {SetupFormulaMipComponent} from './setup-formula-mip/setup-formula-mip.component';
import {SetupIccComponent} from './setup-formula-mip/setup-icc/setup-icc.component';
import {ApplyParametersComponent} from './setup-formula-mip/apply-parameters/apply-parameters.component';
import {PartSaleDlrToTmvComponent} from './part-sale-dlr-to-tmv/part-sale-dlr-to-tmv.component';
import {ReportModalComponent} from './part-sale-dlr-to-tmv/report-modal/report-modal.component';
import {PartsRetailOrderComponent} from './part-sale-dlr-to-tmv/parts-retail-order/parts-retail-order.component';
import {RejectModalComponent} from './part-sale-dlr-to-tmv/reject-modal/reject-modal.component';
import {PartsRetailNewTabOrderComponent} from './parts-retail/parts-retail-new-tab-order/parts-retail-new-tab-order.component';
import {NewManualTabOrderComponent} from './parts-manual-order/new-manual-tab-order/new-manual-tab-order.component';
import {LexusReturnToDealerComponent} from './lexus-return-to-dealer/lexus-return-to-dealer.component';
import {LexusDeliveryOrderModalComponent} from './lexus-return-to-dealer/lexus-delivery-order-modal/lexus-delivery-order-modal.component';
import {LexusPartsReceiveDetailModalComponent} from './lexus-return-to-dealer/lexus-parts-receive-detail-modal/lexus-parts-receive-detail-modal.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  BoPartsOrderComponent,
  BoPartsDetailOrderComponent,
  BoOrderSlipModalComponent,

  BoOrderFollowupComponent,
  BoOrderFollowupDetailsComponent,

  BoOrderFollowupNvptComponent,
  BoFollowupNvptEditModalComponent,

  RoLackOfPartsExportComponent,
  PartsOrderForStoringComponent,
  StoringPartsOrderDetailComponent,

  PartsExportComponent,
  PartsExportShippingHistoryComponent,
  PrepickListComponent,
  PartsExportSingleSlipModalComponent,
  PartsExportViewSlipModalComponent,
  PartSelectPrintFormatModalComponent,

  PartsRetailComponent,
  PartsRetailNewTabOrderComponent,
  PartsRetailDetailComponent,
  PartsRetailNewOrderComponent,
  PartsRetailCheckingModalComponent,

  PartsLookupInfoHistoryCheckboxComponent,
  PartsLookupInfoCheckboxComponent,
  PartsLookupInfoComponent,

  PartsManualOrderComponent,
  NewManualTabOrderComponent,
  NewManualOrderModalComponent,
  PartsManualCheckingModalComponent,
  SelectPackOfPartsModalComponent,

  PartsInStockAdjustmentComponent,

  PartsInfoManagementComponent,
  ImportPartsInfoModalComponent,
  EditPartManagementInfoModalComponent,

  PartsSpecialOrderComponent,
  NewSpecialOrderModalComponent,
  PartsSpecialCheckingModalComponent,

  PartsInStockStatusComponent,

  PartsCancelOrderRequestComponent,

  PartsOrderPrePlanComponent,
  NewOrderPrePlanModalComponent,
  PartsPrePlanCheckingModalComponent,

  PartsReceiveAutomaticComponent,
  PartsReceiveDetailModalComponent,
  DeliveryOrderModalComponent,

  PartsReceiveManualComponent,
  PartsReceiveManualDetailModalComponent,

  PartsUpcommingInfoComponent,
  PartsCancelTrackingComponent,

  PartsExportLackLookupComponent,
  ListRoExportLackComponent,
  ListCommandBoNoExportComponent,
  ShippingModalComponent,

  DeadStockPartForSaleComponent,
  DeadStockPartSearchingComponent,

  SendClaimComponent,
  SendClaimModalComponent,
  ApprovalClaimModalComponent,
  ApprovalClaimComponent,
  SendClaimAttachedFileModalComponent,

  MipCalculateComponent,
  MipImportComponent,

  PartsRepairPositionPrepickComponent,

  PartsOnhandOrderFollowupComponent,

  PartsCheckPriceCodeComponent,
  NewCheckPriceCodeModalComponent,

  PartsReceiveHistoryComponent,

  PartShippingHistoryComponent,
  PartShippingDetailModalComponent,

  OrderForLexusPartComponent,
  PartsNonLexusOrderLexusComponent,
  PartNonLexusOrderLexusOrderTmvModalComponent,

  SetupFormulaMipComponent,
  SetupIccComponent,
  ApplyParametersComponent,

  PartSaleDlrToTmvComponent,
  ReportModalComponent,
  PartsRetailOrderComponent,
  RejectModalComponent,

  LexusReturnToDealerComponent,
  LexusDeliveryOrderModalComponent,
  LexusPartsReceiveDetailModalComponent
];

const EntryComponents = [
  BoPartsOrderComponent,
  BoOrderFollowupComponent,
  BoOrderFollowupNvptComponent,
  RoLackOfPartsExportComponent,
  PartsOrderForStoringComponent,
  PartsExportComponent,
  PartsExportShippingHistoryComponent,
  PartsRetailComponent,
  PartsRetailNewTabOrderComponent,
  PartsLookupInfoComponent,
  PartsManualOrderComponent,
  NewManualTabOrderComponent,
  PartsInStockAdjustmentComponent,
  PartsInfoManagementComponent,
  PartsSpecialOrderComponent,
  PartsInStockStatusComponent,
  PartsCancelOrderRequestComponent,
  PartsOrderPrePlanComponent,
  PartsReceiveAutomaticComponent,
  PartsReceiveManualComponent,
  PartsUpcommingInfoComponent,
  PartsCancelTrackingComponent,
  PartsExportLackLookupComponent,
  DeadStockPartForSaleComponent,
  DeadStockPartSearchingComponent,
  SendClaimComponent,
  ApprovalClaimComponent,
  MipCalculateComponent,
  MipImportComponent,
  PartsRepairPositionPrepickComponent,
  PartsOnhandOrderFollowupComponent,
  PartsCheckPriceCodeComponent,
  PartsReceiveHistoryComponent,
  PartShippingHistoryComponent,
  OrderForLexusPartComponent,
  PartsNonLexusOrderLexusComponent,
  SetupFormulaMipComponent,
  PartSaleDlrToTmvComponent,
  LexusReturnToDealerComponent
];

const map = {
  [TMSSTabs.dlrBoPartsExport]: PartsExportComponent,
  [TMSSTabs.dlrBoPartsRequest]: BoPartsOrderComponent,
  [TMSSTabs.dlrBoPartsFollowup]: BoOrderFollowupComponent,
  [TMSSTabs.dlrBoPartsFollowupNvpt]: BoOrderFollowupNvptComponent,
  [TMSSTabs.dlrRoLackOfParts]: RoLackOfPartsExportComponent,
  [TMSSTabs.dlrPartsOrderForStoring]: PartsOrderForStoringComponent,
  [TMSSTabs.dlrPartsRetail]: PartsRetailComponent,
  [TMSSTabs.dlrPartsRetailNewTabOrder]: PartsRetailNewTabOrderComponent,
  [TMSSTabs.dlrPartsManualOrder]: PartsManualOrderComponent,
  [TMSSTabs.newManualTabOrder]: NewManualTabOrderComponent,
  [TMSSTabs.dlrPartsInStockAdjustment]: PartsInStockAdjustmentComponent,
  [TMSSTabs.dlrPartsSpecialOrder]: PartsSpecialOrderComponent,
  [TMSSTabs.dlrPartsPrePlanOrder]: PartsOrderPrePlanComponent,
  [TMSSTabs.dlrPartsInStockStatus]: PartsInStockStatusComponent,
  [TMSSTabs.dlrPartsInfoManagement]: PartsInfoManagementComponent,
  [TMSSTabs.dlrPartsCancelOrderRequest]: PartsCancelOrderRequestComponent,
  [TMSSTabs.dlrPartsReceiveAuto]: PartsReceiveAutomaticComponent,
  [TMSSTabs.dlrPartsReceiveManual]: PartsReceiveManualComponent,
  [TMSSTabs.dlrPartsReceiveNonToyota]: PartsReceiveManualComponent,
  [TMSSTabs.dlrPartsUpcommingInfo]: PartsUpcommingInfoComponent,
  [TMSSTabs.dlrPartsLookupInfo]: PartsLookupInfoComponent,
  [TMSSTabs.dlrPartsExportLackLookup]: PartsExportLackLookupComponent,
  [TMSSTabs.dlrPartsCancelChecking]: PartsCancelTrackingComponent,
  [TMSSTabs.dlrDeadStockPartForSale]: DeadStockPartForSaleComponent,
  [TMSSTabs.dlrDeadStockPartSearching]: DeadStockPartSearchingComponent,
  [TMSSTabs.dlrSendClaim]: [ApprovalClaimComponent, SendClaimComponent],
  [TMSSTabs.dlrPartsRepairPositionPrepick]: PartsRepairPositionPrepickComponent,
  [TMSSTabs.dlrMipCalculate]: MipCalculateComponent,
  [TMSSTabs.dlrOnhandOrderFollowup]: PartsOnhandOrderFollowupComponent,
  [TMSSTabs.partsCheckPriceCode]: PartsCheckPriceCodeComponent,
  [TMSSTabs.partsReciveHistory]: PartsReceiveHistoryComponent,
  [TMSSTabs.partShippingHistory]: PartShippingHistoryComponent,
  [TMSSTabs.mipImport]: MipImportComponent,
  [TMSSTabs.orderForLexusPart]: OrderForLexusPartComponent,
  [TMSSTabs.partsNonLexusOrderLexus]: PartsNonLexusOrderLexusComponent,
  [TMSSTabs.setupFormulaMIP]: SetupFormulaMipComponent,
  [TMSSTabs.partSaleDlrToTmv]: PartSaleDlrToTmvComponent,
  [TMSSTabs.lexusReturnToDealer]: LexusReturnToDealerComponent
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
  providers: [
    PartsManagementService
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class PartsManagementModule {
  static getComponent(key) {
    return map[key];
  }
}
