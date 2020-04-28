import { BaseModel } from '../base.model';

export interface RetailOrderModel extends BaseModel {
  stt?: number;
  ctno: string;
  attribute1;
  attribute2;
  checkTlccpt: number;
  createDate: number;
  createdBy: number;
  csstate: string;
  cusId: number;
  deleteflag;
  discount: number;
  discountAmount: number;
  dlrId: number;
  id: number;
  kCalc: string;
  modifiedBy: number;
  modifyDate: number;
  quotationprint: number;
  salesdate: number;
}

export interface PartsRetailDetailModel extends BaseModel {
  customer?: CustomerOfRetailOrderModel;
  parts?: Array<PartsOfRetailOrderModel>;
  price?: {
    preTaxPrice?: number
    taxPrice?: number
    discount?: number
    totalPrice?: number
  };
}

export interface CustomerOfRetailOrderModel extends BaseModel {
  orderNo?: string;
  orderType?: string;
  customerType?: string;
  customerTypeId?: number;
  mobile?: string;
  customerCode?: string;
  customerId?: number;
  phone?: string;
  fax?: string;
  account?: string;
  customerName?: string;
  companyName?: string;
  bankName?: string;
  bankId?: number;
  address?: string;
  taxNo?: string;
  discountPercent?: number;
  discountPrice?: number;
}

export interface PartsOfRetailOrderModel extends BaseModel {
  stt?: number;
  partsId?: number;
  partsCode?: string;
  pstate?: string;
  partsName?: string;
  partsNameVn?: string;
  unit?: string;
  onHandQty?: number;
  ddQty?: number;
  qty?: number;
  dxQty?: number;
  sellPrice?: number;
  sumPrice?: number;
  rate?: number;
  frCd: string;
}
