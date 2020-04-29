import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {AccordionModule} from 'ngx-bootstrap';
import {KeyboardShortcutsModule} from 'ng-keyboard-shortcuts';

import {GateInOutComponent} from './gate-in-out/gate-in-out.component';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {CustomerServiceReceptionComponent} from './customer-service-reception/customer-service-reception.component';
import {AdvisorDeskChangeComponent} from './customer-service-reception/advisor-desk-change/advisor-desk-change.component';
import {ReceptionistComponent} from './receptionist/receptionist.component';
import {ReceivingVehicleComponent} from './receiving-vehicle/receiving-vehicle.component';
import {ProgressForCustomersComponent} from './progress-for-customers/progress-for-customers.component';
import {VehicleInOutModalComponent} from './gate-in-out/vehicle-in-out-modal/vehicle-in-out-modal.component';
import {VehicleInModalComponent} from './receptionist/vehicle-in-modal/vehicle-in-modal.component';
import {ScreenWaitReceptionComponent} from './screen-wait-reception/screen-wait-reception.component';

const Components = [
  GateInOutComponent,
  CustomerServiceReceptionComponent,
  ScreenWaitReceptionComponent,
  ReceivingVehicleComponent,
  VehicleInModalComponent,
  VehicleInOutModalComponent,
  ProgressForCustomersComponent,
  ScreenWaitReceptionComponent,
  ReceptionistComponent
];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    DragDropModule,
    SharedModule,
    AccordionModule,
    KeyboardShortcutsModule
  ],
  declarations: [
    Components,
    AdvisorDeskChangeComponent
  ],
  exports: [
    Components
  ]
})
export class QueuingSystemModule {
}
