import { BaseModel } from '../base.model';

export interface HistoryUpdateComplainModel extends BaseModel {
  supplier?: string;
  staffs?: string;
  dateUpdate?: string;
  toDate?: string;
}
