import { BaseModel } from '../base.model';

export interface InquiryPriceCodeModel extends BaseModel {
  stt?: number;
  fullmodelcode: string;
  inquiryno: string;
  vinnoFrameno: string;
  queryCode: string;
  queryPrice: string;
  personQuery: string;
  createDate: number;
  status: string;
  remark: string;
  remarkTmv: string;
  telPersonQuery: string;
  deleteflag?;
  dlrCode?;
}

export interface PartsOfInquiryModel extends BaseModel {
  stt?: string;
  partscode: string;
  partsname: string;
  pnc: number;
  substitutionpartno: null;
  remark: string;
  status: string;
  respondDate: number;
  remarkTmv: string;
  createDate?;
  deleteflag?;
  modelno?;
  modifiedBy?;
  modifyDate?;
  partsnamevn?;
  partstype?;
  queryPricecodeDId?;
  queryPricecodeId?;
  rate?;
  sellprice?;
  seqdisplay?;
  supplierId?;
  inquiryStatus: any;
}
