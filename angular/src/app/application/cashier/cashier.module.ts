import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {CashierBlockComponent} from './cashier-block/cashier-block.component';
import {CarNotSettlementOutGateComponent} from './car-not-settlement-out-gate/car-not-settlement-out-gate.component';
import {GoOutGatePrintingComponent} from './cashier-block/go-out-gate-printing/go-out-gate-printing.component';
import {CashierDetailComponent} from './cashier-block/cashier-detail/cashier-detail.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  CashierBlockComponent,
  CarNotSettlementOutGateComponent,
  GoOutGatePrintingComponent,
  CashierDetailComponent
];

const EntryComponents = [
  CashierBlockComponent,
  CarNotSettlementOutGateComponent
];

const map = {
  [TMSSTabs.cashier]: CashierBlockComponent,
  [TMSSTabs.carNotSettlementToOutGate]: CarNotSettlementOutGateComponent
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
export class CashierModule {
  static getComponent(key) {
    return map[key];
  }
}
