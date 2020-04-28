import { BaseModel } from '../base.model';

export interface RoInfoModel extends BaseModel {
  licensePlate;
  customer;
  address;
  taxCode;
  cvdv;
}
