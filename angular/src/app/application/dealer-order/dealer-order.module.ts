import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {TMSSTabs} from '../../core/constains/tabs';
import {CbuOrderComponent} from './first-order/cbu-order/cbu-order.component';
import {CbuOrderSecondComponent} from './second-order/cbu-order/cbu-order-second.component';
import {DlrOrderSecondComponent} from './second-order/dlr-order/dlr-order-second.component';

const Components = [
  CbuOrderComponent,
  CbuOrderSecondComponent,
  DlrOrderSecondComponent
];

const EntryComponents = [
  CbuOrderComponent,
  CbuOrderSecondComponent,
  DlrOrderSecondComponent
];

const map = {
  [TMSSTabs.cbuOrder]: CbuOrderComponent,
  // [TMSSTabs.dlrOrderSummary]: DlrOrderComponent,
  [TMSSTabs.secondCbuOrder]: CbuOrderSecondComponent,
  [TMSSTabs.secondCkdOrder]: DlrOrderSecondComponent
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
export class DealerOrderModule {
  static getComponent(key) {
    return map[key];
  }
}
