import { BaseModel } from '../base.model';

export interface RcTypeModel extends BaseModel {
  rctypeid: string;
  rctypecode: string;
  rctypename: string;
  srvcomtype: string;
  workCode: string;
}

