import { BaseModel } from '../base.model';

export interface SendClaimModel extends BaseModel {
  stt?: number;
  sVoucher: string;
  claimId: number;
  claimNo: string;
  claimStatus: string;
  createdBy: number;
  createdDate: number;
  dlrCode: string;
  dlrId: number;
  dlrRemark: string;
  invoiceNo: string;
  modifiedBy: string;
  modifiedDate: number;
  orderId: number;
  orderNo: string;
  partsRecvId: number;
  prStatus: string;
  shipDate: number;
}

export interface PartsOfSendClaimModel extends BaseModel {
  partsCode: string;
  partsName: string;
  qtyOrder: number;
  qtyRecv: number;
  sai: number;
  vo: number;
  hong: number;
  thieu: number;
  netprice: number;
  sumPrice?: number;
  remarkDlr: string;
  dlrId: number;
  locationNo: string;
  partsId: number;
  partsRecvid: number;
  qtyRecvact: number;
  remarkTmv: string;
  unitId: number;
  ton: number;
}
