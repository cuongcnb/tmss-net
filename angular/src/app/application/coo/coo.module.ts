import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {VehicleHistoryComponent} from './vehicle-history/vehicle-history.component';
import {GeneralRepairProgressComponent} from './general-repair-progress/general-repair-progress.component';
import {DongSonProgressComponent} from './dong-son-progress/dong-son-progress.component';
import {DongSonProgressModalComponent} from './dong-son-progress/dong-son-progress-modal/dong-son-progress-modal.component';
import {CreatePlanModalComponent} from './dong-son-progress/create-plan-modal/create-plan-modal.component';
import {JobStopModalComponent} from './dong-son-progress/job-stop-modal/job-stop-modal.component';
import {JobAriseModalComponent} from './dong-son-progress/job-arise-modal/job-arise-modal.component';
import {RepairAriseModalComponent} from './general-repair-progress/repair-arise-modal/repair-arise-modal.component';
import {RepairPlanModalComponent} from './general-repair-progress/repair-plan-modal/repair-plan-modal.component';
import {PendingPlanModalComponent} from './general-repair-progress/pending-plan-modal/pending-plan-modal.component';
import {ContinuePlanModalComponent} from './general-repair-progress/continue-plan-modal/continue-plan-modal.component';
import {CompletePlanModalComponent} from './dong-son-progress/complete-plan-modal/complete-plan-modal.component';
import {CompletePlanRxModalComponent} from './car-wash-progress/complete-plan-rx-modal/complete-plan-rx-modal.component';
import {StoppedPlanModalComponent} from './general-repair-progress/stopped-plan-modal/stopped-plan-modal.component';
import {EmployeeListModalComponent} from './general-repair-progress/employee-list-modal/employee-list-modal.component';
import {InfoGeneralRepairProgressComponent} from './info-general-repair-progress/info-general-repair-progress.component';
import {InfoDongsonModalComponent} from './info-general-repair-progress/info-dongson-modal/info-dongson-modal.component';
import {InfoGeneralRepairModalComponent} from './info-general-repair-progress/info-general-repair-modal/info-general-repair-modal.component';
import {CarWashProgressComponent} from './car-wash-progress/car-wash-progress.component';
import {DongSonProgressByCarComponent} from './dong-son-progress-by-car/dong-son-progress-by-car.component';
import {DongSonProgressByWshopComponent} from './dong-son-progress-by-wshop/dong-son-progress-by-wshop.component';
import {KeyboardShortcutsModule} from 'ng-keyboard-shortcuts';
import {TMSSTabs} from '../../core/constains/tabs';
import {EmpComponent} from './emp/emp.component';
import {ManagementStatusComponent} from './management-status/management-status.component';
import {ManagementVehicleUnusualComponent} from './management-status/management-vehicle-unusual/management-vehicle-unusual.component';
import {ManagementVehicleComponent} from './management-status/management-vehicle/management-vehicle.component';
import { VehicleInProgressModalComponent } from './dong-son-progress/complete-plan-modal/vehicle-in-progress-modal/vehicle-in-progress-modal.component';
import { UpcomingCollisionModalComponent } from './general-repair-progress/upcoming-collision-modal/upcoming-collision-modal.component';

const Components = [
  VehicleHistoryComponent,
  GeneralRepairProgressComponent,
  RepairPlanModalComponent,
  DongSonProgressComponent,
  DongSonProgressModalComponent,
  CreatePlanModalComponent,
  InfoGeneralRepairProgressComponent,
  CarWashProgressComponent,
  DongSonProgressByCarComponent,
  DongSonProgressByWshopComponent,
  EmpComponent,
  ManagementStatusComponent,
  ManagementVehicleUnusualComponent,
  ManagementVehicleComponent
];

const EntryComponents = [
  VehicleHistoryComponent,
  GeneralRepairProgressComponent,
  DongSonProgressComponent,
  InfoGeneralRepairProgressComponent,
  EmpComponent,
  CarWashProgressComponent,
  DongSonProgressByCarComponent,
  DongSonProgressByWshopComponent,
  ManagementStatusComponent
];

const map = {
  [TMSSTabs.generalRepairProgress]: GeneralRepairProgressComponent,
  [TMSSTabs.infoGeneralRepairProgress]: InfoGeneralRepairProgressComponent,
  [TMSSTabs.dongsonProgress]: DongSonProgressComponent,
  [TMSSTabs.dongsonProgressByCar]: DongSonProgressByCarComponent,
  [TMSSTabs.dongsonProgressByWshop]: DongSonProgressByWshopComponent,
  [TMSSTabs.vehicleHistory]: VehicleHistoryComponent,
  [TMSSTabs.carWash]: CarWashProgressComponent,
  [TMSSTabs.emp]: EmpComponent,
  [TMSSTabs.managementStatus]: ManagementStatusComponent
};

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    KeyboardShortcutsModule.forRoot()
  ],
  declarations: [
    Components,
    JobStopModalComponent,
    JobAriseModalComponent,
    RepairAriseModalComponent,
    EmployeeListModalComponent,
    InfoDongsonModalComponent,
    InfoGeneralRepairModalComponent,
    StoppedPlanModalComponent,
    PendingPlanModalComponent,
    ContinuePlanModalComponent,
    CompletePlanModalComponent,
    CompletePlanRxModalComponent,
    VehicleInProgressModalComponent,
    UpcomingCollisionModalComponent,
  ],
  exports: [
    Components,
    CarWashProgressComponent
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class CooModule {
  static getComponent(key) {
    return map[key];
  }
}
