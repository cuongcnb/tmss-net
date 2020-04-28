import { BaseModel } from '../base.model';

export interface BoPartsFollowupCvdvModel extends BaseModel {
  stt?: number;
  soRo: string;
  bienSoXe: string;
  tenCvdv: string;
  eta: number;
  isInvoice: string;
  checkEta: boolean;
  ata: number;
  thoigianHen: number;
  ptQuahan: number;
  checkXeTrongXuong: boolean;
  reasonDelay: string;
  dailyGhichu: string;
  specialFollowUp: any;

  dlrId?: number;
  news?: string;
  ngayDh?: number;
  reqId?: number;
  reqtype?: number;
  userId?: number;
  xeTrongXuong?: string;
  mapColors?: object;
}

export interface AdvisorViewDetailModel extends BaseModel {
  stt?: number;
  maPt: string;
  soLuong: number;
  tenPt: string;
  nguon: string;
  standardEta: number;
  thoigianHen: number;
  custOrderDate: number;
  requestDate: number;
  eta: number;
  ata: number;
  specialFollowUp: string;

  ataTmv?: number;
  custOrderNo?: number;
  cvdv?: string;
  dlrId?: number;
  etaTmv?: number;
  isInvoice?: string;
  news?: string;
  overdue?: number;
  reasonDelay?: string;
  registerNo?: string;
  reqId?: number;
  reqtype?: number;
  ro?: string;
  supplierName?: string;
  userId?: number;
}

export interface AdvisorEditedDataModel extends BaseModel {
  stt?: number;
  appointmentDate: number;
  contactDate: number;
  id: number;
  isInGarage: boolean;
  note: string;
  ro: string;
}
