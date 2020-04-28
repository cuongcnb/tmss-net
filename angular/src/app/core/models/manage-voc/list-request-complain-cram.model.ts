import { BaseModel } from '../base.model';

export interface ListRequestComplainCramModel extends BaseModel {
  supplier?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
}
