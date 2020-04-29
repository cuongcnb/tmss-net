import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {FirContactQuestionsComponent} from './fir-contact-questions/fir-contact-questions.component';
import {NewContactQuestionComponent} from './fir-contact-questions/new-contact-question/new-contact-question.component';
import {ListPartsErrorsComponent} from './list-parts-errors/list-parts-errors.component';
import {NewPartsModalComponent} from './list-parts-errors/new-parts-modal/new-parts-modal.component';
import {ErrorCauseComponent} from './error-cause/error-cause.component';
import {ErrorCauseModalComponent} from './error-cause/error-cause-modal/error-cause-modal.component';
import {ListErrorsFieldsComponent} from './list-errors-fields/list-errors-fields.component';
import {ErrorFieldModalComponent} from './list-errors-fields/error-field-modal/error-field-modal.component';
import {ListReasonNotContactComponent} from './list-reason-not-contact/list-reason-not-contact.component';
import {NotContactModalComponent} from './list-reason-not-contact/not-contact-modal/not-contact-modal.component';
import {ErrorCodeComponent} from './error-code/error-code.component';
import {ErrorCodeModalComponent} from './error-code/error-code-modal/error-code-modal.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  FirContactQuestionsComponent,
  ListErrorsFieldsComponent,
  ListPartsErrorsComponent,
  ErrorCodeComponent,
  ErrorCauseComponent,
  ListReasonNotContactComponent
];

const EntryComponents = [
  FirContactQuestionsComponent,
  ListErrorsFieldsComponent,
  ListPartsErrorsComponent,
  ErrorCodeComponent,
  ErrorCauseComponent,
  ListReasonNotContactComponent
];

const map = {
  [TMSSTabs.firContactQuestions]: FirContactQuestionsComponent,
  [TMSSTabs.agencyContactQuestions]: FirContactQuestionsComponent,
  [TMSSTabs.listErrorField]: ListErrorsFieldsComponent,
  [TMSSTabs.listPartError]: ListPartsErrorsComponent,
  [TMSSTabs.isErrorCode]: ErrorCodeComponent,
  [TMSSTabs.errorCause]: ErrorCauseComponent,
  [TMSSTabs.reasonNotContact]: ListReasonNotContactComponent
};

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule
  ],
  declarations: [
    Components,
    NewContactQuestionComponent,
    NewPartsModalComponent,
    ErrorFieldModalComponent,
    ErrorCodeModalComponent,
    ErrorCauseModalComponent,
    NotContactModalComponent
  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class FirCategoryModule {
  static getComponent(key) {
    return map[key];
  }
}
