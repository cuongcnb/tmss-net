import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {FleetUnitComponent} from './fleet-unit/fleet-unit.component';
import {ModifyFleetUnitComponent} from './fleet-unit/modify-fleet-unit/modify-fleet-unit.component';
import {FleetSchemesComponent} from './fleet-schemes/fleet-schemes.component';
import {ModifyFleetSchemesComponent} from './fleet-schemes/modify-fleet-schemes/modify-fleet-schemes.component';
import {FleetSaleApplicationComponent} from './fleet-sale-application/fleet-sale-application.component';
import {HistoryModalComponent} from './fleet-sale-application/history-modal/history-modal.component';
import {FleetCustomerComponent} from './fleet-customer/fleet-customer.component';
import {ModifyFleetCustomerComponent} from './fleet-customer/modify-fleet-customer/modify-fleet-customer.component';
import {FleetFollowUpComponent} from './fleet-follow-up/fleet-follow-up.component';
import {FollowAlertModalComponent} from './fleet-follow-up/follow-alert-modal/follow-alert-modal.component';
import {FollowDetailComponent} from './fleet-follow-up/follow-detail/follow-detail.component';
import {ChangePurchasingDeliveryComponent} from './fleet-sale-application/change-purchasing-delivery/change-purchasing-delivery.component';
import {NewFleetAppModalComponent} from './fleet-sale-application/new-fleet-app-modal/new-fleet-app-modal.component';
import {MainDisplayIntentionGridComponent} from './fleet-sale-application/main-display-grid/main-display-intention-grid/main-display-intention-grid.component';
import {MainDisplayDeliveryGridComponent} from './fleet-sale-application/main-display-grid/main-display-delivery-grid/main-display-delivery-grid.component';
import {ChangePurchasingActiveIntentionGridComponent} from './fleet-sale-application/change-purchasing-delivery/change-purchasing-grid/change-purchasing-active-intention-grid/change-purchasing-active-intention-grid.component';
import {ChangePurchasingActiveDeliveryGridComponent} from './fleet-sale-application/change-purchasing-delivery/change-purchasing-grid/change-purchasing-active-delivery-grid/change-purchasing-active-delivery-grid.component';
import {ChangePurchasingRequestDeliveryGridComponent} from './fleet-sale-application/change-purchasing-delivery/change-purchasing-grid/change-purchasing-request-delivery-grid/change-purchasing-request-delivery-grid.component';
import {ChangePurchasingRequestIntentionGridComponent} from './fleet-sale-application/change-purchasing-delivery/change-purchasing-grid/change-purchasing-request-intention-grid/change-purchasing-request-intention-grid.component';
import {HistoryModalActiveIntentionGridComponent} from './fleet-sale-application/history-modal/history-modal-grid/history-modal-active-intention-grid/history-modal-active-intention-grid.component';
import {HistoryModalActiveDeliveryGridComponent} from './fleet-sale-application/history-modal/history-modal-grid/history-modal-active-delivery-grid/history-modal-active-delivery-grid.component';
import {HistoryModalPreviousIntentionGridComponent} from './fleet-sale-application/history-modal/history-modal-grid/history-modal-previous-intention-grid/history-modal-previous-intention-grid.component';
import {HistoryModalPreviousDeliveryGridComponent} from './fleet-sale-application/history-modal/history-modal-grid/history-modal-previous-delivery-grid/history-modal-previous-delivery-grid.component';
import {FleetAppApproveModalComponent} from './fleet-sale-application/fleet-app-approve-modal/fleet-app-approve-modal.component';
import {FleetEditGridDlrComponent} from './fleet-sale-application/fleet-sale-grid-edit-modal/fleet-edit-grid-dlr/fleet-edit-grid-dlr.component';
import {FleetCustomerSelectModalComponent} from './fleet-sale-application/fleet-customer-select-modal/fleet-customer-select-modal.component';
import {FleetEditGridTmvComponent} from './fleet-sale-application/fleet-sale-grid-edit-modal/fleet-edit-grid-tmv/fleet-edit-grid-tmv.component';
import {TMSSTabs} from '../../core/constains/tabs';
import {FleetFollowUpFilterComponent} from './fleet-follow-up/fleet-follow-up-filter/fleet-follow-up-filter.component';

const Components = [
  FleetUnitComponent,
  ModifyFleetUnitComponent,
  FleetSchemesComponent,
  ModifyFleetSchemesComponent,
  FleetSaleApplicationComponent,
  HistoryModalComponent,
  FleetCustomerComponent,
  ModifyFleetCustomerComponent,
  FleetFollowUpComponent,
  FollowAlertModalComponent,
  FollowDetailComponent,
  ChangePurchasingDeliveryComponent,
  NewFleetAppModalComponent,
  MainDisplayIntentionGridComponent,
  MainDisplayDeliveryGridComponent,
  ChangePurchasingActiveIntentionGridComponent,
  ChangePurchasingActiveDeliveryGridComponent,
  ChangePurchasingRequestDeliveryGridComponent,
  ChangePurchasingRequestIntentionGridComponent,
  HistoryModalActiveIntentionGridComponent,
  HistoryModalActiveDeliveryGridComponent,
  HistoryModalPreviousIntentionGridComponent,
  HistoryModalPreviousDeliveryGridComponent,
  FleetAppApproveModalComponent,
  FleetEditGridDlrComponent,
  FleetCustomerSelectModalComponent,
  FleetEditGridTmvComponent,
  // FleetFollowUpFilterComponent
];

const EntryComponents = [
  FleetCustomerComponent,
  FleetSaleApplicationComponent,
  FleetSchemesComponent,
  FleetUnitComponent,
];

const map = {
  [TMSSTabs.fleetCustomer]: FleetCustomerComponent,
  [TMSSTabs.dlrFleetSaleApplication]: FleetSaleApplicationComponent,
  [TMSSTabs.fleetSaleApplicationTMV]: FleetSaleApplicationComponent,
  [TMSSTabs.salesPerson]: FleetUnitComponent,
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule
  ],
  declarations: [
    Components,
  ],
  exports: [
    Components
  ],
  entryComponents: [EntryComponents],
  providers: []
})

export class FleetSaleModule {
  static getComponent(key) {
    return map[key];
  }
}
