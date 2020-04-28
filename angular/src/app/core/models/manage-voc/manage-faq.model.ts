import { BaseModel } from '../base.model';

export interface ManageFaqModel extends BaseModel {
  supplier?: string;
  question?: string;
  answer?: string;
  status?: string;
}
