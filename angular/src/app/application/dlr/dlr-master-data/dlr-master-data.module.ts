import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {CoreModule} from '../../../core/core.module';
import {SalesGroupComponent} from './sales-group/sales-group.component';
import {SalesGroupModalComponent} from './sales-group/sales-group-modal/sales-group-modal.component';
import {SalesTeamModalComponent} from './sales-group/sales-team-modal/sales-team-modal.component';
import {SalesPersonComponent} from './sales-person/sales-person.component';
import {SalesPersonDetailComponent} from './sales-person/sales-person-detail/sales-person-detail.component';
import {LocationOfYardComponent} from './location-of-yard/location-of-yard.component';
import {LocationOfYardModalComponent} from './location-of-yard/location-of-yard-modal/location-of-yard-modal.component';
import {TMSSTabs} from '../../../core/constains/tabs';

const Components = [
  SalesGroupComponent,
  SalesGroupModalComponent,
  SalesTeamModalComponent,
  SalesPersonComponent,
  SalesPersonDetailComponent,
  LocationOfYardComponent,
  LocationOfYardModalComponent,
  LocationOfYardComponent
];

const EntryComponents = [
  LocationOfYardComponent,
  SalesGroupComponent,
  SalesPersonComponent,
];

const map = {
  // [TMSSTabs.yardLocation]: LocationOfYardComponent,
  [TMSSTabs.salesGroup]: SalesGroupComponent,
  [TMSSTabs.salesPerson]: SalesPersonComponent,
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
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
export class DlrMasterDataModule {
  static getComponent(key) {
    return map[key];
  }
}
