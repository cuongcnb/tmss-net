import { BaseModel } from '../base.model';

export interface OrderForLexusPartModel extends BaseModel {
  stt;
  partsCode;
  partsName;
  unit;
  price;
  qty;
  sumPrice;
  rate;
}
