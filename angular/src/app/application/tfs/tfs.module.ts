import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {DealersBalanceComponent} from './dealers-balance/dealers-balance.component';
import {PaymentFollowupComponent} from './payment-followup/payment-followup.component';
import {PaymentFollowupApproveModalComponent} from './payment-followup/payment-followup-approve-modal/payment-followup-approve-modal.component';
import {DealerBalanceEditModalComponent} from './dealers-balance/dealer-balance-edit-modal/dealer-balance-edit-modal.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  DealersBalanceComponent,
  PaymentFollowupComponent,
  PaymentFollowupApproveModalComponent,
  DealerBalanceEditModalComponent,
];
const map = {
  [TMSSTabs.dealersBalance]: DealersBalanceComponent,
  [TMSSTabs.paymentFollowup]: PaymentFollowupComponent,
};
const EntryComponents = [
  DealersBalanceComponent,
  PaymentFollowupComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
  ],
  declarations: [
    Components,
  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})

export class TfsModule {
  static getComponent(key) {
    return map[key];
  }
}
