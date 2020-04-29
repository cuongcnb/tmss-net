import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {NewPromotionComponent} from './new-promotion/new-promotion.component';
import {NewPromotionDetailComponent} from './new-promotion/new-promotion-detail/new-promotion-detail.component';
import {RegisTestDriveComponent} from './regis-test-drive/regis-test-drive.component';
import {RegisTestDriveDetailComponent} from './regis-test-drive/regis-test-drive-detail/regis-test-drive-detail.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  NewPromotionComponent,
  RegisTestDriveComponent
];

const EntryComponents = [
  NewPromotionComponent,
  RegisTestDriveComponent
];

const map = {
  [TMSSTabs.isNewPromotion]: NewPromotionComponent,
  [TMSSTabs.regisTestDrive]: RegisTestDriveComponent
};

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule
  ],
  declarations: [
    Components,
    NewPromotionDetailComponent,
    RegisTestDriveDetailComponent
  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class NewInfomationModule {
  static getComponent(key) {
    return map[key];
  }
}
