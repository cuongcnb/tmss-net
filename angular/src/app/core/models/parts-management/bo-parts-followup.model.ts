import { BaseModel } from '../base.model';

export interface BoPartsFollowupModel extends BaseModel {
  stt?;
  soRo;
  bienSoXe;
  tenCvdv;
  maPt;
  tenPt;
  slCan;
  slPrepick;
  slDat;
  slDaVe;
  ngayDh;
  eta;
  note;
  ngayVe;
  soNhv;
  viTri;

  dlrId?;
  ngayRo?;
  partsId?;
  reqId?;
  reqtype?;
  seqdisplay?;
  slDaXuat?;
  ngayVeDu?;
}

export interface BoDetailViewModel extends BaseModel {
  stt?: number;
  orderNo: string;
  soRo: string;
  bienSoXe: string;
  tenCvdv: string;
  ngayDh: number;
  kieuDh: string;
  dateCount: number;

  countApproval?: number;
  countCancel?: number;
  countItem?: number;
  countNormal?: number;
  countReq?: number;
  countSend?: number;
  countSep?: number;
  dlrId?: number;
  orderId?: number;
  reqId?: number;
  reqtype?: number;
}

export interface PartOfBoDetailModel extends BaseModel {
  stt?: number;
  maPt: string;
  tenPt: string;
  dvt: string;
  slDat: number;
  supplier: string;
  eta: number;
  eta1: number;
  eta2: number;
  slDaVe: number;
  ngayVe: number;
  ghiChu: string;

  dlrId?: number;
  orderId?: number;
  seqdisplay?: number;
  slDaXuat?: number;
}
