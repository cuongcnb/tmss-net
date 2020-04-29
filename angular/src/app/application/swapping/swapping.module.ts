import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DlrVehicleInformationComponent} from './dlr-vehicle-information/dlr-vehicle-information.component';
import {NationwideSellingListComponent} from './nationwide-selling-list/nationwide-selling-list.component';
import {NationwideBuyingListComponent} from './nationwide-buying-list/nationwide-buying-list.component';
import {SearchingVehicleComponent} from './searching-vehicle/searching-vehicle.component';
import {SwappingVehicleComponent} from './swapping-vehicle/swapping-vehicle.component';
import {SellSwapReportComponent} from './sell-swap-report/sell-swap-report.component';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {DispatchChangeRequestComponent} from './dispatch-change-request/dispatch-change-request.component';
import {AdditionNationwideBuyingModalComponent} from './nationwide-buying-list/addition-nationwide-buying-modal/addition-nationwide-buying-modal.component';
import {SellBuyMatchingComponent} from './sell-buy-matching/sell-buy-matching.component';
import {DlrVehicleSellCheckboxComponent} from './dlr-vehicle-information/dlr-vehicle-sell-checkbox/dlr-vehicle-sell-checkbox.component';
import {DlrChangeAdvanceRequestModalComponent} from './dlr-vehicle-information/dlr-change-advance-request-modal/dlr-change-advance-request-modal.component';
import {DispatchChangeApproveModalComponent} from './dispatch-change-request/dispatch-change-approve-modal/dispatch-change-approve-modal.component';
import {EditAdditionalBuyingComponent} from './nationwide-buying-list/edit-additional-buying/edit-additional-buying.component';
import {AdvanceReportComponent} from './advance-report/advance-report.component';
import {TMSSTabs} from '../../core/constains/tabs';


const EntryComponents = [
  DlrVehicleSellCheckboxComponent,
  AdvanceReportComponent,
  DispatchChangeRequestComponent,
  DlrVehicleInformationComponent,
  NationwideSellingListComponent,
  NationwideBuyingListComponent,
  SearchingVehicleComponent,
  SellBuyMatchingComponent,
  SellSwapReportComponent,
  SwappingVehicleComponent,
];

const map = {
  [TMSSTabs.advanceReport]: AdvanceReportComponent,
  [TMSSTabs.dispatchChangeRequest]: DispatchChangeRequestComponent,
  [TMSSTabs.nationwideSellingList]: NationwideSellingListComponent,
  [TMSSTabs.nationwideBuyingList]: NationwideBuyingListComponent,
  [TMSSTabs.searchingVehicle]: SearchingVehicleComponent,
  [TMSSTabs.sellBuyMatching]: SellBuyMatchingComponent,
  [TMSSTabs.sellSwapReport]: SellSwapReportComponent,
  [TMSSTabs.swappingVehicle]: SwappingVehicleComponent,
  [TMSSTabs.dlrVehicleInformation]: DlrVehicleInformationComponent,
};


const Components = [
  DlrVehicleInformationComponent,
  NationwideSellingListComponent,
  NationwideBuyingListComponent,
  SearchingVehicleComponent,
  SwappingVehicleComponent,
  SellSwapReportComponent,
  DispatchChangeRequestComponent,
  AdditionNationwideBuyingModalComponent,
  DlrChangeAdvanceRequestModalComponent,
  DispatchChangeApproveModalComponent,
  SellBuyMatchingComponent,
  EditAdditionalBuyingComponent,
  AdvanceReportComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
  ],
  declarations: [
    Components,
    EntryComponents,
  ],
  exports: [
    Components,
  ],
  entryComponents: [EntryComponents]
})

export class SwappingModule {
  static getComponent(key) {
    return map[key];
  }
}
