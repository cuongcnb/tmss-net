import { BaseModel } from '../base.model';

export interface FleetFollowUpModel extends BaseModel {
  dealer: string;
  customerName: string;
  totalQuantity: string;
  cdToTmv: string;
  tmvRefNo: string;
  contractNo: string;
  contractDate: Date;
  expireDate: Date;
  cancel: string;
  frameNo: string;
  grade: string;
  color: string;
  tmvInvNo: string;
  tmvInvDate: Date;
  amountVnd: number;
  amountUsd: number;
  type: string;
  saleDate: Date;
  dlrInvoiceNo;
  dlrInvoiceDate: Date;
  reAmount: number;
  fwsp: string;
  nwsp: string;
  branch: string;
  customerProfile: string;
  volumeRange: string;
  registrationPlate: string;
  remark: string;
}

export interface FollowUpDetailModel extends BaseModel {
  dealer: string;
  tmvRefNo: string;
  customerName?: string;
  fleetAppDate?: Date;
  approveDate?: Date;
  volumeRange?: string;
  expiryDate?: Date;
  contractNo?: string;
  wodDate?: Date;
  depositDate?: Date;
}
