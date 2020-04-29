import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {DlrOrderToLexusManagementComponent} from './dlr-order-to-lexus-management/dlr-order-to-lexus-management.component';
import {ListOfDlrOrderToLexusComponent} from './list-of-dlr-order-to-lexus/list-of-dlr-order-to-lexus.component';
import {LexusPartsPriceManagementComponent} from './lexus-parts-price-management/lexus-parts-price-management.component';
import {PriceUpdateComponent} from './lexus-parts-price-management/price-update/price-update.component';
import {ImportPriceModalComponent} from './lexus-parts-price-management/import-price-modal/import-price-modal.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  DlrOrderToLexusManagementComponent,
  ListOfDlrOrderToLexusComponent,
  LexusPartsPriceManagementComponent,
  PriceUpdateComponent,
  ImportPriceModalComponent
];

const EntryComponents = [
  DlrOrderToLexusManagementComponent,
  ListOfDlrOrderToLexusComponent,
  LexusPartsPriceManagementComponent
];

const map = {
  [TMSSTabs.dlrOrderToLexusManagement]: DlrOrderToLexusManagementComponent,
  [TMSSTabs.listOfDlrOrderToLexus]: ListOfDlrOrderToLexusComponent,
  [TMSSTabs.lexusPartsPriceManagement]: LexusPartsPriceManagementComponent
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
export class SrvModule {
  static getComponent(key) {
    return map[key];
  }
}
