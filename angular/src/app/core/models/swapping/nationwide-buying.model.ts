import { BaseModel } from '../base.model';

export interface NationwideBuyingModel extends BaseModel {
  transStatus?: string;
  grade?: string;
  color?: string;
  expectedArrivalDate?: string;
  dealer?: string;
  registerDate?: string;
  sellingColor?: string;
  sellingLod?: string;
  sellingDlr?: string;
  tmvApprovedDate?: string;
  dealerApprovedDate?: string;
}

export interface AdditionNationwideBuyingItem extends BaseModel {
  transStatus;
  dealer;
  dealerId: number;
  gradeId: number;
  colorId: number;
  expectedArrivalDate: Date;
  registerDate;
  sellingColor;
  sellingLod;
  sellingDlr;
  tmvApprovedDate;
  dlrApprovedDate;
  remark: string;
}
