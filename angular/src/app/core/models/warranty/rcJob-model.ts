import { BaseModel } from '../base.model';

export interface RcJobModel extends BaseModel {
  internal?: string;
  jobgroup?: number;
  jobtype?: string;
  rccode?: string;
  rcname?: string;
  rcyear?: number;
  remark?: string;
}
