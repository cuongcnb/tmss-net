import { BaseModel } from '../base.model';

export interface PartsMipModel extends BaseModel {
  partsId?: number;
  partsCode?: string;
  partsName?: string;
  oldPart?: string;
  newPart?: string;
  unit?: string;
  price?: number;
  tax?: number;
  qty?: number;
  instockType?: number;
  mad?: number;
  mip?: number;
  last1Qty?: number; // so luong ban
  last1Number?: number; // so lan ban
  last2Qty?: number; // so luong ban
  last2Number?: number; // so lan ban
  last3Qty?: number; // so luong ban
  last3Number?: number; // so lan ban
  last4Qty?: number; // so luong ban
  last4Number?: number; // so lan ban
  last5Qty?: number; // so luong ban
  last5Number?: number; // so lan ban
  last6Qty?: number; // so luong ban
  last6Number?: number; // so lan ban
  tbtx?: number; // trung binh cong tan suat 6 thang
  pair?: number;
  madTT?: number; // mad thang trc
  madLT?: number; // mad ly thuyet
  mipTT?: number;
  mipLT?: number;
  mipReal?: number; // mip thuc te
  icc?: string;
}
