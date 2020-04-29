import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {TrackCustomerNotBackComponent} from './track-customer-not-back/track-customer-not-back.component';
import {TrackCustomerNotBackContentComponent} from './track-customer-not-back/track-customer-not-back-content/track-customer-not-back-content.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  TrackCustomerNotBackComponent,
  TrackCustomerNotBackContentComponent
];

const EntryComponents = [
  TrackCustomerNotBackComponent
];

const map = {
  [TMSSTabs.trackCustomerNotBack]: TrackCustomerNotBackComponent,
  [TMSSTabs.trackCustomerBuyCarNotBack]: TrackCustomerNotBackComponent
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
export class TrackCustomerModule {
  static getComponent(key) {
    return map[key];
  }
}
