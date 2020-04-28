import { BaseModel } from '../base.model';

export interface DeadStockPartModel extends BaseModel {
  partsId?: number;
  partsCode?: string;
  partsName?: string;
  dlrCode?: string;
  qty?: number;
  price?: number;
}
