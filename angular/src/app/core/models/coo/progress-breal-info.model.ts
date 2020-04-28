import { BaseModel } from '../base.model';

export interface ProgressBrealInfoModel extends BaseModel {
  repairorderno: string;
  reasoncontent: string;
  brdate: string;
  ctdate: string;
  wshopCode: string;
  brtype: string;
}
