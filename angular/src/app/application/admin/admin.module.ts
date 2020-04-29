import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnListComponent } from './column-list/column-list.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { FormColumnComponent } from './form-column/form-column.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { UserColumnComponent } from './user-column/user-column.component';
import { ModifyColumnListModalComponent } from './column-list/modify-column-list-modal/modify-column-list-modal.component';
import { ModifyFormColumnModalComponent } from './form-column/modify-form-column-modal/modify-form-column-modal.component';
import { ModifyFormGroupModalComponent } from './form-group/modify-form-group-modal/modify-form-group-modal.component';
import { ModifyColumnOfGroupModalComponent } from './form-group/modify-column-of-group-modal/modify-column-of-group-modal.component';
import { DealerIpConfigComponent } from './dealer-ip-config/dealer-ip-config.component';
import { DealerIpConfigModalComponent } from './dealer-ip-config/dealer-ip-config-modal/dealer-ip-config-modal.component';
import { CheckLogVehiclesComponent } from './check-log-vehicles/check-log-vehicles.component';
import { IsViewCheckboxComponent } from './user-column/is-view-checkbox.component';
import { IsUpdateCheckboxComponent } from './user-column/is-update-checkbox.component';
import { UpdateCheckboxUserColumnService } from './user-column/update-checkbox-user-column.service';
import {TMSSTabs} from '../../core/constains/tabs';


const Components = [
  ColumnListComponent,
  FormColumnComponent,
  ModifyColumnListModalComponent,
  FormColumnComponent,
  FormGroupComponent,
  UserColumnComponent,
  ModifyFormColumnModalComponent,
  ModifyFormGroupModalComponent,
  ModifyColumnOfGroupModalComponent,
  DealerIpConfigModalComponent,
  DealerIpConfigComponent,
  CheckLogVehiclesComponent,
  IsViewCheckboxComponent,
  IsUpdateCheckboxComponent,
];
const EntryComponents = [
  IsViewCheckboxComponent,
  IsUpdateCheckboxComponent,
  ColumnListComponent,
  FormGroupComponent,
  FormColumnComponent,
  UserColumnComponent,
  DealerIpConfigComponent,
  CheckLogVehiclesComponent
];

const map = {
  [TMSSTabs.columnList]: ColumnListComponent,
  [TMSSTabs.formColumn]: FormColumnComponent,
  [TMSSTabs.formGroup]: FormGroupComponent,
  [TMSSTabs.userColumn]: UserColumnComponent,
  [TMSSTabs.dealerIpConfig]: DealerIpConfigComponent,
  [TMSSTabs.tmssCheckLogs]: CheckLogVehiclesComponent,
  [TMSSTabs.checkLogVehicles]: CheckLogVehiclesComponent,
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
  ],
  declarations: [
    Components
  ],
  exports: [
    Components
  ],
  entryComponents: [
    IsViewCheckboxComponent,
    IsUpdateCheckboxComponent,
    EntryComponents
  ],
  providers: [
    UpdateCheckboxUserColumnService,
  ]
})
export class AdminModule {
  static getComponent(key) {
    return map[key];
  }
}
