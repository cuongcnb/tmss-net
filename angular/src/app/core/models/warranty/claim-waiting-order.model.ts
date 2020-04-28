import { BaseModel } from '../base.model';

export interface ClaimWaitingOrderModel extends BaseModel {
  no?;
  orderno?;
  claimcount?;
  arrivaldate?;
  dealercode?;
}
