import { BaseModel } from '../base.model';

export interface BankModel extends BaseModel {
  bankAdd: string;
  bankCode: string;
  bankName: string;
  email: string;
  fax: string;
  status: string;
  tel: string;
}
