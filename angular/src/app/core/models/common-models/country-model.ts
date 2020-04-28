import { BaseModel } from '../base.model';

export interface CountryModel extends BaseModel {
  ctCode?: string;
  ctName?: string;
  remark?: string;
  signal?: string;
}
