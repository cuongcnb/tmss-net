import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {UpdateDvDataComponent} from './update-dv-data/update-dv-data.component';
import {ImportInvoiceModalComponent} from './update-dv-data/import-invoice-modal/import-invoice-modal.component';
import {LockRoModalComponent} from './update-dv-data/lock-ro-modal/lock-ro-modal.component';
import {DecisionDateModalComponent} from './update-dv-data/decision-date-modal/decision-date-modal.component';
import {HideColumnModalComponent} from './update-dv-data/hide-column-modal/hide-column-modal.component';
import {SettlementDebtAccessoryComponent} from './settlement-debt-accessory/settlement-debt-accessory.component';
import {SettlementDebtModalComponent} from './settlement-debt-accessory/settlement-debt-modal/settlement-debt-modal.component';
import {InputFormatAfterSaleComponent} from './input-format-after-sale/input-format-after-sale.component';
import {KpiInputInvoiceComponent} from './kpi-input-invoice/kpi-input-invoice.component';
import {InputFormatBeforeSaleComponent} from './input-format-before-sale/input-format-before-sale.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  UpdateDvDataComponent,
  SettlementDebtAccessoryComponent,
  InputFormatAfterSaleComponent,
  KpiInputInvoiceComponent,
  InputFormatBeforeSaleComponent
];

const map = {
  [TMSSTabs.updateDvData]: UpdateDvDataComponent,
  [TMSSTabs.isSettlementDebtAccessory]: SettlementDebtAccessoryComponent,
  [TMSSTabs.isInputFormatData]: InputFormatAfterSaleComponent,
  [TMSSTabs.isInputFormatDataBefore]: InputFormatBeforeSaleComponent,
  [TMSSTabs.isInputInvoice]: KpiInputInvoiceComponent
};

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule
  ],
  declarations: [
    Components,
    ImportInvoiceModalComponent,
    LockRoModalComponent,
    DecisionDateModalComponent,
    HideColumnModalComponent,
    SettlementDebtModalComponent
  ],
  exports: [
    Components
  ],
  entryComponents: [
    Components
  ]
})
export class ServiceKpiDataModule {
  static getComponent(key) {
    return map[key];
  }
}
