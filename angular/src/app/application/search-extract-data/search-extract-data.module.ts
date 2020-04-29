import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {SearchCustomerComponent} from './search-customer/search-customer.component';
import {GeneralInfoComponent} from './search-customer/general-info/general-info.component';
import {ContacHistoryDatatableComponent} from './search-customer/contac-history-datatable/contac-history-datatable.component';
import {InfoHistoryDatatableComponent} from './search-customer/info-history-datatable/info-history-datatable.component';
import {CallSearchComponent} from './call-search/call-search.component';
import {ListCustomerAppointmentComponent} from './list-customer-appointment/list-customer-appointment.component';
import {CustomerBuyNewCarComponent} from './customer-buy-new-car/customer-buy-new-car.component';
import {CriteriaOneComponent} from './customer-buy-new-car/criteria-one/criteria-one.component';
import {CriteriaTwoComponent} from './customer-buy-new-car/criteria-two/criteria-two.component';
import {CustomerServiceComponent} from './customer-service/customer-service.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  SearchCustomerComponent,
  CallSearchComponent,
  ListCustomerAppointmentComponent,
  CustomerServiceComponent,
  CustomerBuyNewCarComponent
];

const EntryComponents = [
  SearchCustomerComponent,
  CallSearchComponent,
  ListCustomerAppointmentComponent,
  CustomerServiceComponent,
  CustomerBuyNewCarComponent
];

const map = {
  [TMSSTabs.searchCustomer]: SearchCustomerComponent,
  [TMSSTabs.callSearch]: CallSearchComponent,
  [TMSSTabs.listCustomerAppointment]: ListCustomerAppointmentComponent,
  [TMSSTabs.customerService]: CustomerServiceComponent,
  [TMSSTabs.customerBuyNewCar]: CustomerBuyNewCarComponent
};

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule
  ],
  declarations: [
    Components,
    GeneralInfoComponent,
    ContacHistoryDatatableComponent,
    InfoHistoryDatatableComponent,
    CriteriaOneComponent,
    CriteriaTwoComponent
  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class SearchExtractDataModule {
  static getComponent(key) {
    return map[key];
  }
}
