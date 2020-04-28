import { BaseModel } from '../base.model';

export interface BoPartsFollowupNvptModel extends BaseModel {
  bienso: string;
  cvdv: string;
  lenhsuachua: string;
  orderNo: string;
  custOrdPartNo: string; // maPT
  matmvxuly: string;
  originalQty: number;
  supplierName: string;
  standardEta: number;
  overdue: number;
  requestDate: number;
  custOrderDate: number;
  eta1: number;
  ataTmv: number;
  supplierInvoiceNo: string;
  ptQuahan: number;
  reasonDelay: string;
  viTriPrepick: string;
  ghichu: string;

  partName?: string;
  supplierCd?: string;
  tmvOrderDate?: number;
  emailToSplrDate?: number;
  supplierReplyDate?: string;
  tmvInfDlrDate?: string;
  etd?: number;
  boEtd1?: number;
  etdRevisionTime?: number;
  firstEtd?: number;
  siteId?: number;
  model?: string;
  releaseDate?: number;
  custOrderNo?: string;
  dealer?: string;
  dlrId?: number;
  productionEndDate?: number;
  etdRequest?: number;
  etaVn?: number;
  cClearance?: number;
  news?: string;
  borrowProduction?: string;
  stockProduction?: string;
  etaToTmv?: number;
  coo?: string;
  rostate?: string;
  csstate?: string;
  isdone?: string;
  isAtaTmv?: string;
  vitrigiahangsop?: string;
}
