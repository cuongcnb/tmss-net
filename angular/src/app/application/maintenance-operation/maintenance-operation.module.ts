import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {SuccessfulContactComponent} from './maintenance-calling/successful-contact/successful-contact.component';
import {MaintenanceInfomationComponent} from './maintenance-calling/maintenance-infomation/maintenance-infomation.component';
import {ContactHistoryComponent} from './maintenance-calling/contact-history/contact-history.component';
import {RepairHistoryComponent} from './maintenance-calling/repair-history/repair-history.component';
import {MaintenanceMessageComponent} from './maintenance-message/maintenance-message.component';
import {MaintenanceMessageContentComponent} from './maintenance-message/maintenance-message-content/maintenance-message-content.component';
import {MaintenanceLetterComponent} from './maintenance-letter/maintenance-letter.component';
import {MaintenanceLetterContentComponent} from './maintenance-letter/maintenance-letter-content/maintenance-letter-content.component';
import {MaintenanceMessageModalComponent} from './maintenance-message/maintenance-message-modal/maintenance-message-modal.component';
import {MaintenanceLetterModalComponent} from './maintenance-letter/maintenance-letter-modal/maintenance-letter-modal.component';
import {MaintenanceCallingComponent} from './maintenance-calling/maintenance-calling.component';
import {MaintenanceDetailComponent} from './maintenance-calling/maintenance-detail/maintenance-detail.component';
import {PotentialCustomersModule} from './maintenance-calling/potential-customers/potential-customers.module';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  MaintenanceMessageContentComponent,
  MaintenanceLetterComponent,
  MaintenanceMessageComponent,
  MaintenanceCallingComponent
];

const EntryComponents = [
  MaintenanceCallingComponent,
  MaintenanceMessageComponent
];

const map = {
  [TMSSTabs.maintenanceCalling]: MaintenanceCallingComponent,
  [TMSSTabs.maintenanceCallingNotContact]: MaintenanceCallingComponent,
  [TMSSTabs.maintenanceMessage]: MaintenanceMessageComponent,
  [TMSSTabs.maintenanceLetter]: MaintenanceMessageComponent
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
    MaintenanceLetterContentComponent,
    SuccessfulContactComponent,
    MaintenanceInfomationComponent,
    ContactHistoryComponent,
    RepairHistoryComponent,
    MaintenanceMessageModalComponent,
    MaintenanceLetterModalComponent,
    MaintenanceDetailComponent

  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class MaintenanceOperationModule {
  static getComponent(key) {
    return map[key];
  }
}
