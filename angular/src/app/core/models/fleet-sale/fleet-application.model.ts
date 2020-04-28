import { BaseModel } from '../base.model';

export interface FleetApplicationModel extends BaseModel {
  dlrRefNo: string;
  tmvRefNo: string;
  date: Date;
  status: string;
  inContract;
}

export interface FleetAppCustomerInfoModel extends BaseModel {
  fleetAppHistoryId?: number;
  customerName: string;
  fleetCustomerId: string;
  tel: string;
  fax: string;
  taxCode: string;
  businessField: string;
  customerAddress: string;
  province: number;
  contactName: string;
  genderId: string;
  ageLeadTimeId: string;
  contactAddress: string;
  contactTel: string;
  invoiceName: string;
  invoiceAddress: string;
  remark: string;
}

export interface MainDisplayFleetAppIntentionModel extends BaseModel {
  fleetAppHistoryId: number;
  grade: string;
  gradeId: number;
  gradeProduction: string;
  gradeProductionId: string;
  color: string;
  colorId: number;
  quantity;

  frsp;
  fwsp;
  discount: number;
}

export interface MainDisplayFleetAppDeliveryModel extends BaseModel {
  fleetAppHistoryId: number;
  grade: string;
  gradeId: number;
  gradeProduction: string;
  gradeProductionId: number;
  quantity;
  month: number;
  year: number;

  quantityTmv;
  monthTmv: number;
  yearTmv: number;
}

export interface SuggestPriceModel extends BaseModel {
  grade: string;
  color: string;
  qty: string;
  frsp: string;
  fwsp: string;
  discount: number;
}

export interface FleetAppHistoryModel extends BaseModel {
  date: Date;
}
