import { BaseModel } from '../base.model';

export interface ManualOrderModel extends BaseModel {
  orderNo: string;
  orderDate;
  orderPersonId: number;
  orderPerson: string;
  transportTypeId: number;
  transportType: string;
  orderTypeId: number;
  orderTypeName: string;
}

export interface PartsOfManualOrderModel extends BaseModel {
  stt: number;
  partsCode: string;
  partsName: string;
  unit: string;
  mad: number;
  onHandQty: number;
  onOrderQty: number;
  mip: number;
  suggestOrderQty: number;
  cpd: number;
  spd: number;
  maxAllocate: number;
  qty: number;
  boQty: number;
  price: number;
  sumPrice: number;
  rate: number;
  frCd: string;
}
