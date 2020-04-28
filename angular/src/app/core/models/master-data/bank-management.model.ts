import { BaseModel } from '../base.model';

export interface BankManagementModel extends BaseModel {
  bankCode: string;
  bankName: string;
  status: string;
  bankTypeId: string;
  ordering: number;
  address: string;
}
