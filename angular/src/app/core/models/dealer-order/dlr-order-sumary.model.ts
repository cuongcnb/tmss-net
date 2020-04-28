import {BaseModel} from '../base.model';

export interface DlrOrderSumaryModel extends BaseModel {
  grade: string;
  thkc: number;
  tgp: number;
  ttl: number;
  total: number;
}
