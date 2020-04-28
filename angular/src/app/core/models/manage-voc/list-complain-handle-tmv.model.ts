import { BaseModel } from '../base.model';

export interface ListComplainHandleTmvModel extends BaseModel {
  dateReception?: string;
  toDate?: string;
  contacter?: string;
  licensePlate?: string;
}
