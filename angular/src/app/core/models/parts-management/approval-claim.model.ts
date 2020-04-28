import { BaseModel } from '../base.model';

export interface ApprovalClaimModel extends BaseModel {
  stt?: number;
  claimNo: string;
  claimDate: number;
  claimId: number;
  claimStatus: number;
  createdBy: number;
  createdDate: number;
  dlrCode: string;
  dlrId: number;
  dlrRemark: string;
  invoiceNo: string;
  modifiedBy: number;
  modifiedDate: number;
  orderId: number;
  orderNo: string;
  partsRecvId: number;
  prStatus: string;
  region: string;
  sVoucher: string;
  shipDate: number;
  tmvRemark: string;
}

export interface PartsOfApprovalClaimModel extends BaseModel {
  stt?: number;
}
