import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {SalesTargetComponent} from './sales-target/sales-target.component';
import {SalesTargetModalComponent} from './sales-target/sales-target-modal/sales-target-modal.component';
import {SalesPlanComponent} from './sales-plan/sales-plan.component';
import {SalesPlanModalComponent} from './sales-plan/sales-plan-modal/sales-plan-modal.component';
import {OrderComponent} from './order/order.component';
import {SalesOrderModalComponent} from './order/sales-order-modal/sales-order-modal.component';
import {AllocationComponent} from './allocation/allocation.component';
import {SalesAllocationModalComponent} from './allocation/sales-allocation-modal/sales-allocation-modal.component';
import {CbuColorOrderComponent} from './cbu-color-order/cbu-color-order.component';
import {SalesColorOrderModalComponent} from './cbu-color-order/sales-color-order-modal/sales-color-order-modal.component';
import {DlrRundownComponent} from './dlr-rundown/dlr-rundown.component';
import {NenkeiComponent} from './nenkei/nenkei.component';
import {NenkeiModalComponent} from './nenkei/nenkei-modal/nenkei-modal.component';
import {DealerOrderConfigsComponent} from './dealer-order-configs/dealer-order-configs.component';
import {DealerOrderConfigModalComponent} from './dealer-order-configs/dealer-order-config-modal/dealer-order-config-modal.component';
import {DealerVersionTypeComponent} from './dealer-version-type/dealer-version-type.component';
import {DealerVersionTypeModalComponent} from './dealer-version-type/dealer-version-type-modal/dealer-version-type-modal.component';
import {TMSSTabs} from '../../core/constains/tabs';
import {SalesTargetFleetComponent} from './sales-target-fleet/sales-target-fleet.component';
import {SalesTargetFleetModalComponent} from './sales-target-fleet/sales-target-fleet-modal/sales-target-fleet-modal.component';
import {SalesOrderUploadComponent} from './order/sales-order-upload/sales-order-upload.component';
import {SalesColorOrderUploadComponent} from './cbu-color-order/sales-color-order-upload/sales-color-order-upload.component';
import {AllocationUploadComponent} from './allocation/allocation-upload/allocation-upload.component';
import {DlrRundownUploadComponent} from './dlr-rundown/dlr-rundown-upload/dlr-rundown-upload.component';
import {DlrRundownDownloadComponent} from './dlr-rundown/dlr-rundown-download/dlr-rundown-download.component';
import {DlrRundownExportComponent} from './dlr-rundown/dlr-rundown-export/dlr-rundown-export.component';

const Components = [
  SalesTargetComponent,
  SalesTargetModalComponent,
  SalesPlanComponent,
  SalesPlanModalComponent,
  OrderComponent,
  SalesOrderModalComponent,
  AllocationComponent,
  SalesAllocationModalComponent,
  CbuColorOrderComponent,
  DlrRundownComponent,
  SalesColorOrderModalComponent,
  NenkeiComponent,
  NenkeiModalComponent,
  DealerOrderConfigsComponent,
  DealerOrderConfigModalComponent,
  DealerVersionTypeComponent,
  DealerVersionTypeModalComponent,
  SalesTargetFleetComponent,
  SalesTargetFleetModalComponent,
  SalesOrderUploadComponent,
  SalesColorOrderUploadComponent,
  AllocationUploadComponent,
  DlrRundownUploadComponent,
  DlrRundownDownloadComponent,
  DlrRundownExportComponent
];

const EntryComponents = [
  SalesTargetComponent,
  SalesPlanComponent,
  OrderComponent,
  AllocationComponent,
  DlrRundownComponent,
  CbuColorOrderComponent,
  NenkeiComponent,
  DealerOrderConfigsComponent,
  DealerVersionTypeComponent,
  SalesTargetFleetComponent
];

const map = {
  [TMSSTabs.dealerSalesPlan]: SalesPlanComponent,
  [TMSSTabs.dealerSalesTarget]: SalesTargetComponent,
  [TMSSTabs.dealerOrder]: OrderComponent,
  [TMSSTabs.dealerAllocation]: AllocationComponent,
  [TMSSTabs.dealerSalesTargetFleet]: SalesTargetFleetComponent,
  [TMSSTabs.dealerCbuColorOrder]: CbuColorOrderComponent,
  [TMSSTabs.dealerRunDown]: DlrRundownComponent,
  [TMSSTabs.dealerNenkei]: NenkeiComponent,
  [TMSSTabs.dealerOrderConfig]: DealerOrderConfigsComponent,
  [TMSSTabs.dealerVersionType]: DealerVersionTypeComponent,
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
  ],
  declarations: [
    Components,
  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})

export class DlrOrderModule {
  static getComponent(key) {
    return map[key];
  }
}
