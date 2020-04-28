import { BaseModel } from '../base.model';

export interface CustomersProcessingModel extends BaseModel {
  desk?: string;
  service?: string;
  stt?: string;
  customerType?: string;
  licensePlates?: string;
  time?: string;
  ycsc?: string;
}
