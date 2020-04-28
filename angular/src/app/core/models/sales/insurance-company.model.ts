import { BaseModel } from '../base.model';

export interface InsuranceComModel extends BaseModel {
  accno: string;
  bankId: number;
  email: string;
  fax: string;
  inrCCode: string;
  inrCName: string;
  pic: string;
  picTel: number;
  remark: string;
  smicAdd: string;
  taxcode: string;
  tel: string;
  website: string;
}

export interface InsuranceEmpModel extends BaseModel {
  inrComId?: number;
  name?: string;
  tel?: number;
}
