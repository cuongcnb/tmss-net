import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {OrderSentLexusComponent} from './order-sent-lexus/order-sent-lexus.component';
import {OrderSentLexusTableComponent} from './order-sent-lexus/order-sent-lexus-table/order-sent-lexus-table.component';
import {PartsReceiveAutoLexusComponent} from './parts-receive-auto-lexus/parts-receive-auto-lexus.component';
import {PartsReceiveManualLexusComponent} from './parts-receive-manual-lexus/parts-receive-manual-lexus.component';
import {OrderSpecializedPartsLaxusComponent} from './order-specialized-parts-laxus/order-specialized-parts-laxus.component';
import {PartsReceiveManualDetailLxModalComponent} from './parts-receive-manual-lexus/parts-receive-manual-detail-lx-modal/parts-receive-manual-detail-lx-modal.component';
import {PartsReceiveDetailLexusComponent} from './parts-receive-auto-lexus/parts-receive-detail-lexus/parts-receive-detail-lexus.component';
import {PartsReceiveDeliveryLexusComponent} from './parts-receive-auto-lexus/parts-receive-detail-lexus/parts-receive-delivery-lexus/parts-receive-delivery-lexus.component';
import {LexusPartsReceiveHistoryComponent} from './lexus-parts-receive-history/lexus-parts-receive-history.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  OrderSentLexusComponent,
  OrderSpecializedPartsLaxusComponent,
  PartsReceiveAutoLexusComponent,
  PartsReceiveManualLexusComponent,
  OrderSentLexusTableComponent,
  PartsReceiveManualDetailLxModalComponent,
  LexusPartsReceiveHistoryComponent
];

const EntryComponents = [
  OrderSentLexusComponent,
  OrderSpecializedPartsLaxusComponent,
  PartsReceiveAutoLexusComponent,
  PartsReceiveManualLexusComponent,
  LexusPartsReceiveHistoryComponent
];

const map = {
  [TMSSTabs.isOrderSentLexus]: OrderSentLexusComponent,
  [TMSSTabs.partsReceiveAutoLexus]: PartsReceiveAutoLexusComponent,
  [TMSSTabs.partsReceiveManualLexus]: PartsReceiveManualLexusComponent,
  [TMSSTabs.isOrderSpecializedLaxus]: OrderSpecializedPartsLaxusComponent,
  [TMSSTabs.lexusPartsReceiveHistory]: LexusPartsReceiveHistoryComponent
};

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule
  ],
  declarations: [
    Components,
    PartsReceiveDetailLexusComponent,
    PartsReceiveDeliveryLexusComponent
  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class DlrNewPartModule {
  static getComponent(key) {
    return map[key];
  }
}
