import { BaseModel } from '../base.model';

export interface PartShippingHistoryModel extends BaseModel {
  stt?: number;
  customerName: string;
  phone: string;
  registerNo: string;
  repairOrderNo: string;
  reqId: string;
  reqType: string;
  roDate: number;
  statusLabel: string;
  totalAmountAfterTax: number;
  totalAmountBeforeTax: number;
  totalTax: number;
}

export interface PartShippingHistoryDetailModel {
  partsShippingHistoryDetailInfoDTO: {
    reqTypeLabel: string,
    cusName: string,
    cusAddress: string,
    code: string,
    phone: string,
    mobile: string,
    vehicleNo: string,
    taxNumber: string,
  };
  partsShippingHistoryDetailPartsDTOs: Array<{
    shippingDate: number,
    partTypeLabel: string,
    partCode: string,
    partName: string,
    qty: number,
    sellPrice: number,
    amountBeforeTax: number,
    tax: number,
    statusLabel: string,
    prepickStatus: number,
    shippingStatus: number,
  }>;
}
