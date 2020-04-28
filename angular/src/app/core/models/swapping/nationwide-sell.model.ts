import { BaseModel } from '../base.model';

export interface NationwideSellModel extends BaseModel {
  grade: string;
  gradeId: number;
  color: string;
  colorId: number;
  dealerColorDeadline: Date;
  invoiceRequestDate: Date;
  region: string;
  status?: string;
  lineOffDate?: string;
}
