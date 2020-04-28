import { BaseModel } from '../base.model';

export interface JobGroupModel extends BaseModel {
  gid?: string;
  gjCode?: string;
  gjName?: string;
  remark?: string;
  actualJobTime?: string;
  cmId?: number;
  cfId?: number;
  jobGroup?: string;
  jobTime?: string;
  jobType?: number;
  price?: string;
  rcCode?: string;
  rcName?: string;
  rcjId?: string;
  rcjgId?: string;

}
