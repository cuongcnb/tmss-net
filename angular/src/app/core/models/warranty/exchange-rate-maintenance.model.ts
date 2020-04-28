import { BaseModel } from '../base.model';

// tslint:disable-next-line:no-empty-interface
export interface WarrantyAssignModel extends BaseModel {
  currencyCode: number;
  startDate: Date;
  endDate: Date;
  exchangeRate: number;
}
