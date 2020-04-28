import { BaseModel } from '../base.model';

export interface PartsLookupInfoPartSearchModel extends BaseModel {
  stt?: number;
  partCode: string;
}

export interface PartsLookupInfoModel extends BaseModel {
  stt: number;
  maDl: string;
  maPt: string;
  tenPt: string;
  slTon: number;
  slDanhDau: number;
  oHFOReceived: any;
  slDangDat: any;
  dvt: string;
  gia: number;
  coo: string;
  nhaCc: string;
  leadTime: number;
  maTtOld: any;
  maTt: any;
  stopSalesCd: any;
  nonReorderCd: any;
  deadstockQty: number;
  franchiseName: any;
  bigPartFg: any;
  dlrId: number;
  instocktype: string;
  partsId: number;
  phiChuyenNhanh: any;
  thue: number;
}
