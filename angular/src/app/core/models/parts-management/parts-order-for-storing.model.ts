import { BaseModel } from '../base.model';

export interface PartsOrderForStoringModel extends BaseModel {
  stt?;
  partsId: number;
  partsCode: string;
  partsName: string;
  unit: string;
  unitId: number;
  mad: number;
  mip: number;
  onHandQty: number;
  onOrderQty: number;
  suggestOrderQty: number;
  cpd: number;
  spd: number;
  estLeadTime: number;
  immediateUseQty: number;
  laterUseQty: number;
  price: number;
  sumPrice: number;
  rate: number;
  state: number; // 0: discontinue, 1:have new part, 2: abnormal qty, 3: BO
  remark: string;
  newPartsCode?: string;
  newPartsName: string;
  dlrId?: number;
  genuine?: string;
  instocktype?: string;
  newPartId?: number;
  ohOo?: number;
  qty?: number;
  frCd?: string;
}
