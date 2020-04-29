import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {ModifyAfterProcessComponent} from './modify-after-process/modify-after-process.component';
import {UpdateModifyAfterProcessModalComponent} from './modify-after-process/update-modify-after-process-modal/update-modify-after-process-modal.component';
import {LslhModalComponent} from './modify-after-process/lslh-modal/lslh-modal.component';
import {ContactAfterRepairComponent} from './contact-after-repair/contact-after-repair.component';
import {RepairRequestComponent} from './contact-after-repair/repair-request/repair-request.component';
import {WorkDoneComponent} from './contact-after-repair/work-done/work-done.component';
import {AccessaryComponent} from './contact-after-repair/accessary/accessary.component';
import {InfoCustomerComponent} from './contact-after-repair/info-customer/info-customer.component';
import {InfoReferComponent} from './contact-after-repair/info-refer/info-refer.component';
import {InfoReportComponent} from './contact-after-repair/info-report/info-report.component';
import {ContactCustomerComponent} from './contact-after-repair/contact-customer/contact-customer.component';
import {ContactHistoryComponent} from './contact-after-repair/contact-history/contact-history.component';
import {SearchInfoComponent} from './contact-after-repair/search-info/search-info.component';
import {NodeInfoComponent} from './contact-after-repair/node-info/node-info.component';
import {VocCodeComponent} from './contact-after-repair/voc-code/voc-code.component';
import {AddRequestComponent} from './contact-after-repair/voc-code/add-request/add-request.component';
import {AddInfoComponent} from './contact-after-repair/voc-code/add-info/add-info.component';
import {RepairHistoryComponent} from './contact-after-repair/repair-history/repair-history.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  ModifyAfterProcessComponent,
  UpdateModifyAfterProcessModalComponent,
  LslhModalComponent,
  ContactAfterRepairComponent,
  RepairRequestComponent,
  WorkDoneComponent,
  AccessaryComponent,
  InfoCustomerComponent,
  InfoReferComponent,
  InfoReportComponent,
  ContactCustomerComponent,
  ContactHistoryComponent,
  SearchInfoComponent,
  NodeInfoComponent,
  RepairHistoryComponent,
  VocCodeComponent,
  AddRequestComponent,
  AddInfoComponent
];

const EntryComponents = [
  ModifyAfterProcessComponent,
  ContactAfterRepairComponent
];

const map = {
  [TMSSTabs.firModifyAfterProcess]: ModifyAfterProcessComponent,
  [TMSSTabs.contactAfterRepair]: ContactAfterRepairComponent
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
export class FirModule {
  static getComponent(key) {
    return map[key];
  }
}
