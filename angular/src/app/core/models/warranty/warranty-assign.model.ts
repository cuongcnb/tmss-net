import { BaseModel } from '../base.model';

// tslint:disable-next-line:no-empty-interface
export interface WarrantyAssignModel extends BaseModel {
  model: string;
  pic: string;
  region: number;
  email: string;
  bcc: string;
}
