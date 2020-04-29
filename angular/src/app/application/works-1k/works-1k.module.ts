import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {ContactAfterDays15Component} from './contact-after-days15/contact-after-days15.component';
import {InfoAfterDays15Component} from './contact-after-days15/info-after-days15/info-after-days15.component';
import {InfoContactAfterDays15Component} from './contact-after-days15/info-contact-after-days15/info-contact-after-days15.component';
import {DataAfterDays15Component} from './contact-after-days15/data-after-days15/data-after-days15.component';
import {PotentialCustomersModule} from '../maintenance-operation/maintenance-calling/potential-customers/potential-customers.module';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  ContactAfterDays15Component
];

const EntryComponents = [
  ContactAfterDays15Component
];

const map = {
  [TMSSTabs.contactAfterDays15]: ContactAfterDays15Component,
  [TMSSTabs.contactAfterDays55]: ContactAfterDays15Component,
  [TMSSTabs.contactMaintenanceRemind]: ContactAfterDays15Component
};

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    PotentialCustomersModule
  ],
  declarations: [
    Components,
    InfoAfterDays15Component,
    InfoContactAfterDays15Component,
    DataAfterDays15Component
  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class Works1kModule {
  static getComponent(key) {
    return map[key];
  }
}
