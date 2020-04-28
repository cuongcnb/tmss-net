import { BaseModel } from '../base.model';

export interface FleetCustomerModel extends BaseModel {
  code: string;
  name: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  contactPerson: string;
  contactPersonAddress: string;
  contactPhone: string;
}
