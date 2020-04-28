import { BaseModel } from '../base.model';

export interface RepairJobForCarModel extends BaseModel {
  rccode?: string;
  rcname?: string;
  jobgroup?: string;
  jobtype?: string;
  remark?: string;
  rcyear?: string;
  internal?: string;
  jobsModels?: string;
  jobsModelsDlr?: string;
  listRepairParts?: string;
}
