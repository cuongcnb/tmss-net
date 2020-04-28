import { BaseModel } from '../base.model';

export interface DealerBalanceModel extends BaseModel {
  code: string;
  name: string;
  amount: number;
  adjustment;
}
