import { BaseModel } from '../base.model';

export interface ForecastOrderModel extends BaseModel {
  numberOrder?: string;
  accessaryId?: string;
  accessaryName?: string;
  dvt?: string;
  dad?: string;
  sellAmount?: string;
  inventoryAmount?: string;
  ddAmount?: string;
  mip?: string;
  dkAmount?: string;
  soq?: string;
  realAmount?: string;
  unitPrice?: string;
  money?: string;
  tax?: string;
}
