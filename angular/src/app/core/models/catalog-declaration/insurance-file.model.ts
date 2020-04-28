import { BaseModel } from '../base.model';

export interface InsuranceFileModel extends BaseModel {
  fileId?: number;
  fileName?: string;
}
