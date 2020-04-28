import { BaseModel } from '../base.model';

export interface CategoryComplainProblemModel extends BaseModel {
  codeComplainProblem?: string;
  nameComplainProblemVN?: string;
  nameComplainProblemEN?: string;
  nameComplainField?: string;
  status?: string;
  stt?: string;
  description?: string;
}
