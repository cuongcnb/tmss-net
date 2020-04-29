import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {DistrictListComponent} from './district-list/district-list.component';
import {DistrictListModalComponent} from './district-list/district-list-modal/district-list-modal.component';
import {DealerListComponent} from './dealer-list/dealer-list.component';
import {ModelListComponent} from './model-list/model-list.component';
import {ModelListModalComponent} from './model-list/model-list-modal/model-list-modal.component';
import {GradeListModalComponent} from './model-list/grade-list-modal/grade-list-modal.component';
import {ModifyDealerModalComponent} from './dealer-list/modify-dealer-modal/modify-dealer-modal.component';
import {ProvincesComponent} from './provinces/provinces.component';
import {ProvincesModalComponent} from './provinces/provinces-modal/provinces-modal.component';
import {YardAreaComponent} from './yard-area/yard-area.component';
import {YardAreaModalComponent} from './yard-area/yard-area-modal/yard-area-modal.component';
import {GradeProductionComponent} from './grade-production/grade-production.component';
import {GradeProductionModalComponent} from './grade-production/grade-production-modal/grade-production-modal.component';
import {DealerGroupComponent} from './dealer-group/dealer-group.component';
import {DealerGroupModalComponent} from './dealer-group/dealer-group-modal/dealer-group-modal.component';
import {PetrolComponent} from './petrol/petrol.component';
import {PetrolModalComponent} from './petrol/petrol-modal/petrol-modal.component';
import {YardLocationComponent} from './yard-location/yard-location.component';
import {YardLocationModalComponent} from './yard-location/yard-location-modal/yard-location-modal.component';
import {ColorListComponent} from './color-list/color-list.component';
import {ColorListModalComponent} from './color-list/color-list-modal/color-list-modal.component';
import {ColorAssignmentComponent} from './color-assignment/color-assignment.component';
import {ColorAssignmentModalComponent} from './color-assignment/color-assignment-modal/color-assignment-modal.component';
import {YardManagementComponent} from './yard-management/yard-management.component';
import {YardModifyModalComponent} from './yard-management/yard-modify-modal/yard-modify-modal.component';
import {InteriorAssignmentModalComponent} from './color-assignment/interior-assignment-modal/interior-assignment-modal.component';
import {LogisticsCompanyComponent} from './logistics-company/logistics-company.component';
import {TmvDayoffComponent} from './tmv-dayoff/tmv-dayoff.component';
import {MeansOfTransportationComponent} from './means-of-transportation/means-of-transportation.component';
import {ModifyTransportationModalComponent} from './means-of-transportation/modify-transportation-modal/modify-transportation-modal.component';
import {ModifyTransportationTypeModalComponent} from './means-of-transportation/modify-transportation-type-modal/modify-transportation-type-modal.component';
import {LogisticModalComponent} from './logistics-company/logistic-modal/logistic-modal.component';
import {TruckModalComponent} from './logistics-company/truck-modal/truck-modal.component';
import {InvoiceLeadtimeComponent} from './invoice-leadtime/invoice-leadtime.component';
import {ModifyInvoiceModalComponent} from './invoice-leadtime/modify-invoice-modal/modify-invoice-modal.component';
import {BankManagementComponent} from './bank-management/bank-management.component';
import {BankManagementModalComponent} from './bank-management/bank-management-modal/bank-management-modal.component';
import {InsuranceCompanyComponent} from './insurance-company/insurance-company.component';
import {InsuranceCompanyModalComponent} from './insurance-company/insurance-company-modal/insurance-company-modal.component';
import {AudioManagementComponent} from './audio-management/audio-management.component';
import {AudioManagementModalComponent} from './audio-management/audio-management-modal/audio-management-modal.component';
import {ArrivalLeadtimeComponent} from './arrival-leadtime/arrival-leadtime.component';
import {ArrivalLeadtimeModalComponent} from './arrival-leadtime/arrival-leadtime-modal/arrival-leadtime-modal.component';
import {MoneyDefineComponent} from './money-define/money-define.component';
import {MoneyModifyModalComponent} from './money-define/money-modify-modal/money-modify-modal.component';
import {DealerAddressPrintDeliveryComponent} from './dealer-address-print-delivery/dealer-address-print-delivery.component';
import {ModifyAddressDeliveryComponent} from './dealer-address-print-delivery/modify-address-delivery/modify-address-delivery.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  DistrictListComponent,
  DistrictListModalComponent,
  DealerListComponent,
  ModifyDealerModalComponent,
  ModelListComponent,
  ModelListModalComponent,
  GradeListModalComponent,
  ProvincesComponent,
  MoneyDefineComponent,
  ProvincesModalComponent,
  DealerGroupComponent,
  DealerGroupModalComponent,
  YardAreaComponent,
  YardAreaModalComponent,
  GradeProductionComponent,
  GradeProductionModalComponent,
  PetrolComponent,
  PetrolModalComponent,
  YardLocationComponent,
  YardLocationModalComponent,
  ColorListComponent,
  ColorListModalComponent,
  YardManagementComponent,
  YardModifyModalComponent,
  ColorAssignmentComponent,
  ColorAssignmentModalComponent,
  InteriorAssignmentModalComponent,
  LogisticsCompanyComponent,
  TmvDayoffComponent,
  MeansOfTransportationComponent,
  ModifyTransportationModalComponent,
  ModifyTransportationTypeModalComponent,
  LogisticModalComponent,
  TruckModalComponent,
  InvoiceLeadtimeComponent,
  ModifyInvoiceModalComponent,
  InsuranceCompanyComponent,
  InsuranceCompanyModalComponent,
  BankManagementComponent,
  BankManagementModalComponent,
  AudioManagementComponent,
  AudioManagementModalComponent,
  ArrivalLeadtimeComponent,
  ArrivalLeadtimeModalComponent,
  DealerAddressPrintDeliveryComponent
];

const EntryComponents = [
  ArrivalLeadtimeComponent,
  AudioManagementComponent,
  BankManagementComponent,
  ColorAssignmentComponent,
  ColorListComponent,
  DealerAddressPrintDeliveryComponent,
  DealerGroupComponent,
  DistrictListComponent,
  GradeProductionComponent,
  InsuranceCompanyComponent,
  InvoiceLeadtimeComponent,
  LogisticsCompanyComponent,
  MeansOfTransportationComponent,
  ModelListComponent,
  MoneyDefineComponent,
  ProvincesComponent,
  TmvDayoffComponent,
  YardAreaComponent,
  YardManagementComponent,
  DealerListComponent,
  PetrolComponent,
  YardLocationComponent,
];

const map = {
  [TMSSTabs.arrivalLeadTime]: ArrivalLeadtimeComponent,
  [TMSSTabs.audioManagement]: AudioManagementComponent,
  [TMSSTabs.bankManagement]: BankManagementComponent,
  [TMSSTabs.colorAssignment]: ColorAssignmentComponent,
  [TMSSTabs.colorList]:  ColorListComponent,
  [TMSSTabs.dealerAddressDelivery]: DealerAddressPrintDeliveryComponent,
  [TMSSTabs.dealerGroup]: DealerGroupComponent,
  [TMSSTabs.districtList]: DistrictListComponent,
  [TMSSTabs.gradeProduction]: GradeProductionComponent,
  [TMSSTabs.insuranceCompany]: InsuranceCompanyComponent,
  [TMSSTabs.invoiceLeadtime]:  InvoiceLeadtimeComponent,
  [TMSSTabs.logisticsCompany]: LogisticsCompanyComponent,
  [TMSSTabs.meanOfTransportation]: MeansOfTransportationComponent,
  [TMSSTabs.modelList]: ModelListComponent,
  [TMSSTabs.moneyDefine]: MoneyDefineComponent,
  [TMSSTabs.provinceList]: ProvincesComponent,
  [TMSSTabs.tmvDayoff]: TmvDayoffComponent,
  [TMSSTabs.dlrDayoff]: TmvDayoffComponent,
  [TMSSTabs.yardRegion]: YardAreaComponent,
  [TMSSTabs.yardManagement]: YardManagementComponent,
  [TMSSTabs.yardLocation]: YardLocationComponent,
  [TMSSTabs.dealerList]: DealerListComponent,
  [TMSSTabs.petrolManagement]: PetrolComponent,
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
  ],
  declarations: [
    Components,
    MoneyModifyModalComponent,
    ModifyAddressDeliveryComponent
  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class MasterDataModule {
  static getComponent(key) {
    return map[key];
  }
}
