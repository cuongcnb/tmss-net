import { BaseModel } from '../base.model';

export interface TrackCustomerNotBackModel extends BaseModel {
  checkup?: string;
  customerType?: string;
  estimatedDay?: string;
}
