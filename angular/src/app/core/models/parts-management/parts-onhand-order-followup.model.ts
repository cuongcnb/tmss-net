import { BaseModel } from '../base.model';

export interface OnhandOrderFollowupModel extends BaseModel {
  orderNo: string;
  seqDisplay: number;
  partsCode: string;
  partsId: number;
  partsName: string;
  cancelStatus;
  createDate;
  orderPerson: string;
  deliveryDate;
  sVoucher;
  deliveredQty: number;
  remainQty: number;

  dlrId?: number;
  modifiedBy?: number;
  orderDId?: number;
  orderId?: number;
  orderQty?: number;
  receivedQty?: number;
}
