import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { CsiSurveyResultComponent} from './csi-survey-result/csi-survey-result.component';
import { SsiSurveyResultComponent } from './ssi-survey-result/ssi-survey-result.component';
import { SsiImportResultSurveyComponent } from './ssi-import-result-survey/ssi-import-result-survey.component';
import { CsiImportResultSurveyComponent } from './csi-import-result-survey/csi-import-result-survey.component';

const Components = [
  CsiSurveyResultComponent,
  SsiSurveyResultComponent,
];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
  ],
  declarations: [
    Components,
    SsiImportResultSurveyComponent,
    CsiImportResultSurveyComponent,
  ],
  exports: [
    Components
  ]
})
export class CsiSsiSurveyModule {
}
