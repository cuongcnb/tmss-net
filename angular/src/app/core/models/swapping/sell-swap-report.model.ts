import { BaseModel } from '../base.model';

export interface SellSwapReportModel extends BaseModel {
  grade?: string;
  color?: string;
  tmssNo?: string;
  loPlanDate?: string;
  alloMonth?: string;
  swapDate?: string;
  sellBuyDate?: string;
  swapSellOutDlr?: string;
  swapSellInDlr?: string;
  remark?: string;
}
