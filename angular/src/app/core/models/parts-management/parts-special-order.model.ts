import { BaseModel } from '../base.model';

export interface PartsSpecialOrderModel extends BaseModel {
  dlrCode: string;
  dlrId: number;
  speordNo: string;
  receiveDlr: string;
  dlrNote: string;
  tmvNote: string;
  status: string;
  statusName: string;
  transportTypeId: number;
  transportType: string;
  createdDate: number;
}

export interface PartsOfSpecialOrder extends BaseModel {
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
  remark: string;
  dlrId: number;
  frCd: string;
  id: number;
  partsId: number;
  specialOrderId: number;
  unitId: number;
}
