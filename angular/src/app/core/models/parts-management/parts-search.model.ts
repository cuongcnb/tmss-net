import { BaseModel } from '../base.model';

export interface PartsSearchModel extends BaseModel {
  dealerCode?: string;
  partsCode?: string;
  partsName?: string;
  inStock?: number;
  mark?: number;
  onFirm?;
  willNumber?: number;
  unit?: string;
  price?: string;
  origin?: string;
  supplier?: string;
  lg?: number;
  oldPartsCode?: string;
  newPartsCode?: string;
  stopSale?;
  nonOrder?;
  deadStock?;
  franchiseName?: string;
  bigPage?;
}
