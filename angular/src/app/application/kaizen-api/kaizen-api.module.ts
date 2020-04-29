import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {UpdateKaizenServiceDataComponent} from './update-kaizen-service-data/update-kaizen-service-data.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  UpdateKaizenServiceDataComponent
];

const EntryComponents = [
  UpdateKaizenServiceDataComponent
];

const map = {
  [TMSSTabs.isUpdateKzServiceData]: UpdateKaizenServiceDataComponent
};

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule
  ],
  declarations: [
    Components
  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class KaizenApiModule {
  static getComponent(key) {
    return map[key];
  }
}
