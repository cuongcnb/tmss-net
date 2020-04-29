import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {SsiSurveyListComponent} from './ssi-survey-list/ssi-survey-list.component';
import {SsiSurveyHandleComponent} from './ssi-survey-handle/ssi-survey-handle.component';
import {RemoveTypeComponent} from './remove-type/remove-type.component';
import {InsertModalComponent} from './insert-modal/insert-modal.component';
import {SurveyResultListComponent} from './survey-result-list/survey-result-list.component';
import {UpdateSurveyResultListModalComponent} from './update-survey-result-list-modal/update-survey-result-list-modal.component';
import {BatchSurveyResultModalComponent} from './survey-result-list/batch-survey-result-modal/batch-survey-result-modal.component';
import {BlackListComponent} from './black-list/black-list.component';
import {CopyBlackListComponent} from './black-list/copy-black-list/copy-black-list.component';
import {SsiDataListComponent} from './ssi-data-list/ssi-data-list.component';
import {CopyDataListComponent} from './ssi-data-list/copy-data-list/copy-data-list.component';
import {ImportDataSurveyComponent} from './import-data-survey/import-data-survey.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  SsiSurveyListComponent,
  SsiSurveyHandleComponent,
  RemoveTypeComponent,
  InsertModalComponent,
  SurveyResultListComponent,
  BatchSurveyResultModalComponent,
  UpdateSurveyResultListModalComponent,
  BlackListComponent,
  CopyBlackListComponent,
  SsiDataListComponent,
  CopyDataListComponent
];

const EntryComponents = [
  SsiSurveyListComponent,
  SsiSurveyHandleComponent,
  SurveyResultListComponent,
  BlackListComponent,
  SsiDataListComponent,
  ImportDataSurveyComponent
];

const map = {
  [TMSSTabs.ssiSurveyList]: SsiSurveyListComponent,
  [TMSSTabs.ssiSurveyHandle]: SsiSurveyHandleComponent,
  [TMSSTabs.webSsiSurveyList]: SsiSurveyListComponent,
  [TMSSTabs.webSsiSurveyHandle]: SsiSurveyHandleComponent,
  [TMSSTabs.surveyResultList]: SurveyResultListComponent,
  [TMSSTabs.blackList]: BlackListComponent,
  [TMSSTabs.ssiDataList]: SsiDataListComponent,
  [TMSSTabs.importDataSurvey]: ImportDataSurveyComponent,
  [TMSSTabs.csiSurveyResult]: SurveyResultListComponent,
  [TMSSTabs.blackListCsi]: BlackListComponent,
  [TMSSTabs.csiDataList]: SsiDataListComponent
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
export class SsiModule {
  static getComponent(key) {
    return map[key];
  }
}
