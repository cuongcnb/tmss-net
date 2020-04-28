import {BaseModel} from '../base.model';

export interface DlrOrderModel extends BaseModel {
  grade: string;
  id: number;
  dlr: number;
  retail: number;
  fleet: number;
  total: number;
  date: Date;
}
export interface DlrOrderSumaryModel extends BaseModel {
  models: string;
  retail: number;
  fleet: number;
  total: number;
}
