import { BaseModel } from '../base.model';

export interface CurrencyModel extends BaseModel {
  id: number;
  currencyCode: string;
  currencyName: string;
  deleteflag;
  dlrId: number;
}
