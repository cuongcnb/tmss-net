import {BaseModel} from '../base.model';

export interface DlrNonLexusOrderLexusOrderModel extends BaseModel {
  dlrCode: string;
  dlrId: number;
  dlrCodeDisplay: string;
  lexusOrderNo: string;
  tmvordNo: string;
  receiveDlr: string;
  receiveDlrId: number;
  dlrNote: string;
  lexusNote: string;
  status: string;
  statusName: string;
  transportTypeId: number;
  transportType: string;
  createDate: number;
}

export interface DlrNonLexusOrderLexusPartModel extends BaseModel {
  stt?;
  partsCode: string;
  partsName: string;
  unit: string;
  qty: number;
  price: number;
  sumPrice: number;
  rate: number;
  car: string;
  modelCode: string;
  vin: string;
  keyCode: string;
  seatNo: number;
  dlrId: number;
  frCd: string;
  id: number;
  partsId: number;
  lexusOrderId: number;
  unitId: number;
}
