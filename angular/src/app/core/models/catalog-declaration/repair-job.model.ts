import { BaseModel } from '../base.model';

export interface RepairJobModel extends BaseModel {
  actualJobTime?: number;
  cmId?: number;
  jobGroup?: string;
  jobTime?: number;
  jobType?: string;
  price?: number;
  rcCode?: string;
  rcName?: string;
  rcjId?: number;
  rcjgId?: number;
  remark?: string;
}
