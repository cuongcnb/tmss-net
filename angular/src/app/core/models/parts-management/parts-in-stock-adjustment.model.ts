import { BaseModel } from '../base.model';

export interface PartsInStockAdjustmentModel extends BaseModel {
  partsCode: string;
  partsName: string;
  unit: string;
  price: number;
  sellPrice: number;
  instockTypeName: string;
  instocktype: string;
  locationNo: string;
  mad: number;
  mip: number;
  mipLt: number;
  partsId: number;
  qty: number;
  rate: number;
}

export interface PartsInStockHistoryModel extends BaseModel {
  partsCode;
  partsName;
  unit;
  price;
  inQty;
  outQty;
  rate;
  warehouseDate;
}
