import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {CsiSurveyHandleComponent} from './csi-survey-handle/csi-survey-handle.component';
import {RemoveCustomerModalComponent} from './csi-survey-handle/remove-customer-modal/remove-customer-modal.component';
import {InsertDataComponent} from './csi-survey-handle/insert-data/insert-data.component';
import {CsiSurveyListComponent} from './csi-survey-list/csi-survey-list.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  CsiSurveyHandleComponent,
  InsertDataComponent,
  CsiSurveyListComponent,
  RemoveCustomerModalComponent
];

const EntryComponents = [
  CsiSurveyHandleComponent,
  CsiSurveyListComponent
];

const map = {
  [TMSSTabs.csiSurveyHandle]: CsiSurveyHandleComponent,
  [TMSSTabs.csiSurveyList]: CsiSurveyListComponent,
  [TMSSTabs.webCsiSurveyHandle]: CsiSurveyHandleComponent,
  [TMSSTabs.webCsiSurveyList]: CsiSurveyListComponent
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
export class CsiModule {
  static getComponent(key) {
    return map[key];
  }
}
