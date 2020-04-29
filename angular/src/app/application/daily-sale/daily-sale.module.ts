import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {CbuVehicleInfoComponent} from './cbu-vehicle-info/cbu-vehicle-info.component';
// import {CbuDisplayChoosingModalComponent} from './cbu-vehicle-info/cbu-display-choosing-modal/cbu-display-choosing-modal.component';
import {VehicleArrivalComponent} from './vehicle-arrival/vehicle-arrival.component';
import {ContractManagementComponent} from './contract-management/contract-management.component';
import {CsChangeInformationComponent} from './cs-change-information/cs-change-information.component';
import {CancelContractModalComponent} from './contract-management/cancel-contract-modal/cancel-contract-modal.component';
import {AddContractModalComponent} from './contract-management/add-contract-modal/add-contract-modal.component';
import {AddMultiContractModalComponent} from './contract-management/add-multi-contract-modal/add-multi-contract-modal.component';
import {ContractSaleModalComponent} from './contract-management/contract-sale-modal/contract-sale-modal.component';
import {ContractChangeModelComponent} from './contract-management/contract-change-model/contract-change-model.component';
import {ChangeDeliveryComponent} from './change-delivery/change-delivery.component';
import {ChangeDeliveryDateComponent} from './change-delivery/change-delivery-date/change-delivery-date.component';
import {VehicleArrivalEditModalComponent} from './vehicle-arrival/vehicle-arrival-edit-modal/vehicle-arrival-edit-modal.component';
import {DeliveryLogComponent} from './change-delivery/delivery-log/delivery-log.component';
import {CbuAgEditModalComponent} from './cbu-vehicle-info/cbu-ag-edit-modal/cbu-ag-edit-modal.component';
import {ContractColorEditModalComponent} from './contract-management/contract-color-edit-modal/contract-color-edit-modal.component';
import {VehicleArrivalImportModalComponent} from './vehicle-arrival/vehicle-arrival-modal/vehicle-arrival-import-modal.component';
import {TMSSTabs} from '../../core/constains/tabs';
import {CbuCkdVehicleInfoComponent} from './cbu-ckd-vehicle-info/cbu-ckd-vehicle-info.component';
import {CbuFilterStartModalComponent} from './cbu-ckd-vehicle-info/cbu-filter-start-modal/cbu-filter-start-modal.component';
import { CbuDisplayChoosingModalComponent } from './cbu-ckd-vehicle-info/cbu-display-choosing-modal/cbu-display-choosing-modal.component';

const Components = [
  ContractManagementComponent,
  CbuVehicleInfoComponent,
  VehicleArrivalComponent,
  CsChangeInformationComponent,
  ChangeDeliveryComponent,
  CancelContractModalComponent,
  AddContractModalComponent,
  AddMultiContractModalComponent,
  ContractSaleModalComponent,
  ContractChangeModelComponent,
  ChangeDeliveryDateComponent,
  VehicleArrivalEditModalComponent,
  DeliveryLogComponent,
  CbuAgEditModalComponent,
  ContractColorEditModalComponent,
  VehicleArrivalImportModalComponent,
  CbuCkdVehicleInfoComponent,
  CbuFilterStartModalComponent,
  CbuDisplayChoosingModalComponent
];

const EntryComponents = [
  CbuCkdVehicleInfoComponent,
  CbuVehicleInfoComponent,
  ChangeDeliveryComponent,
  ContractManagementComponent,
  CsChangeInformationComponent,
  VehicleArrivalComponent,
];

const map = {
  [TMSSTabs.cbuVehicleInfo]: CbuCkdVehicleInfoComponent,
  [TMSSTabs.ckdVehicleInfo]: CbuCkdVehicleInfoComponent,
  [TMSSTabs.changeDelivery]: ChangeDeliveryComponent,
  [TMSSTabs.contractManagement]: ContractManagementComponent,
  [TMSSTabs.csChangeInformation]: CsChangeInformationComponent,
  [TMSSTabs.vehicleArrival]: VehicleArrivalComponent,
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

export class DailySaleModule {
  static getComponent(key) {
    return map[key];
  }
}
