import { BaseModel } from '../base.model';

export interface InvoiceLeadTimeModel extends BaseModel {
  departure?: string;
  dealer: string;
  leadTime?: number;
  region?: string;
  transportType?: string;
}
