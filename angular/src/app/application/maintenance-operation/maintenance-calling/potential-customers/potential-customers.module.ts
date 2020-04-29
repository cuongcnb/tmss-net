import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { AccessaryCarComponent } from './accessary-car/accessary-car.component';
import { NewAccessoryCarComponent } from './accessary-car/new-accessary-car/new-accessory-car.component';
import { InfomationShareComponent } from './infomation-share/infomation-share.component';
import { InsurranceCarComponent } from './insurrance-car/insurrance-car.component';
import { NewinsurranceCarComponent } from './insurrance-car/new-insurrance-car/newinsurrance-car.component';
import { NewCarComponent } from './new-car/new-car.component';
import { NewInforCarComponent } from './new-car/new-infor-car/new-infor-car.component';

const Components = [
  AccessaryCarComponent,
  NewAccessoryCarComponent,
  InfomationShareComponent,
  InsurranceCarComponent,
  NewinsurranceCarComponent,
  NewCarComponent,
  NewInforCarComponent,
];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
  ],
  declarations: [
    Components,
  ],
  exports: [
    Components
  ]
})
export class PotentialCustomersModule {
}
