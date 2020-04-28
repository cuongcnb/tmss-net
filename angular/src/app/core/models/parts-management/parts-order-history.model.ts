import { BaseModel } from '../base.model';

export interface OrderHistoryModel extends BaseModel {
  svourcher: string;
  orderno: string;
  invoiceno: string;
  shipdate: number;
  createdBy: number;
  modifyDate: number;
  attribute1;
  attribute2;
  createDate;
  deleteflag;
  dlrId;
  dlrLexus;
  id;
  isLexus;
  lexordNo;
  lxStatus;
  modifiedBy;
  orderId;
  prStatus;
}

export interface PartsOfOrderHistoryModel {
  seqdisplay: number;
  partscode: string;
  partsname: string;
  unitName: string;
  qtyOrder: number;
  qtyRecv: number;
  qtyRecvact: number;
  netprice: number;
  amtBeforeTax: number;
  rate: number;
  locationNo: string;
}
