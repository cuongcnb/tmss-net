import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {ManageQuestionRequestComponent} from './manage-question-request/manage-question-request.component';
import {AddManageQuestionRequestModalComponent} from './manage-question-request/add-manage-question-request-modal/add-manage-question-request-modal.component';
import {ChooseSupplierModalComponent} from './manage-question-request/add-manage-question-request-modal/choose-supplier-modal/choose-supplier-modal.component';
import {QuestionRequestModalComponent} from './manage-question-request/add-manage-question-request-modal/question-request-modal/question-request-modal.component';
import {ManageDiscontentComplainComponent} from './manage-discontent-complain/manage-discontent-complain.component';
import {AddDiscontentComplainModalComponent} from './manage-discontent-complain/add-discontent-complain-modal/add-discontent-complain-modal.component';
import {InfoComplainComponent} from './manage-discontent-complain/add-discontent-complain-modal/info-complain/info-complain.component';
import {SummaryEvaluateComponent} from './manage-discontent-complain/add-discontent-complain-modal/summary-evaluate/summary-evaluate.component';
import {RequestModalComponent} from './manage-discontent-complain/add-discontent-complain-modal/info-complain/request-modal/request-modal.component';
import {PartsModalComponent} from './manage-discontent-complain/add-discontent-complain-modal/info-complain/parts-modal/parts-modal.component';
import {ReferHandlingComplainComponent} from './refer-handling-complain/refer-handling-complain.component';
import {HistoryUpdateComplainComponent} from './history-update-complain/history-update-complain.component';
import {ListComplainHandleTmvComponent} from './list-complain-handle-tmv/list-complain-handle-tmv.component';
import {ListRequestComplainCramComponent} from './list-request-complain-cram/list-request-complain-cram.component';
import {ManageFaqComponent} from './manage-faq/manage-faq.component';
import {AddFaqModalComponent} from './manage-faq/add-faq-modal/add-faq-modal.component';
import {ManageDocumentSupportComponent} from './manage-document-support/manage-document-support.component';
import {AddDocumentModalComponent} from './manage-document-support/add-document-modal/add-document-modal.component';
import {AddDocumentDetailModalComponent} from './manage-document-support/add-document-detail-modal/add-document-detail-modal.component';
import {SearchDocumentSupportComponent} from './search-document-support/search-document-support.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  ManageQuestionRequestComponent,
  AddManageQuestionRequestModalComponent,
  ChooseSupplierModalComponent,
  QuestionRequestModalComponent,
  ManageDiscontentComplainComponent,
  AddDiscontentComplainModalComponent,
  InfoComplainComponent,
  SummaryEvaluateComponent,
  RequestModalComponent,
  PartsModalComponent,
  ReferHandlingComplainComponent,
  HistoryUpdateComplainComponent,
  ListComplainHandleTmvComponent,
  ListRequestComplainCramComponent,
  ManageFaqComponent,
  AddFaqModalComponent,
  ManageDocumentSupportComponent,
  AddDocumentModalComponent,
  AddDocumentDetailModalComponent,
  SearchDocumentSupportComponent
];

const EntryComponents = [
  ManageQuestionRequestComponent,
  ManageDiscontentComplainComponent,
  ReferHandlingComplainComponent,
  HistoryUpdateComplainComponent,
  ListComplainHandleTmvComponent,
  ListRequestComplainCramComponent,
  ManageFaqComponent,
  ManageDocumentSupportComponent,
  SearchDocumentSupportComponent
];

const map = {
  [TMSSTabs.manageQuestionRequest]: ManageQuestionRequestComponent,
  [TMSSTabs.manageDiscontentComplain]: ManageDiscontentComplainComponent,
  [TMSSTabs.manageComplainPotential]: ManageDiscontentComplainComponent,
  [TMSSTabs.referHandlingComplain]: ReferHandlingComplainComponent,
  [TMSSTabs.historyUpdateComplain]: HistoryUpdateComplainComponent,
  [TMSSTabs.listComplainHandleTMV]: ListComplainHandleTmvComponent,
  [TMSSTabs.listRequestComlainCRAM]: ListRequestComplainCramComponent,
  [TMSSTabs.manageFAQ]: ManageFaqComponent,
  [TMSSTabs.manageDocumentSupport]: ManageDocumentSupportComponent,
  [TMSSTabs.searchDocumentSupport]: SearchDocumentSupportComponent
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
export class ManageVocModule {
  static getComponent(key) {
    return map[key];
  }
}
