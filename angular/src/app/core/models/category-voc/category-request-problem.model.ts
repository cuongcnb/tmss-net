import { BaseModel } from '../base.model';

export interface CategoryRequestProblemModel extends BaseModel {
  codeRequestProblem?: string;
  nameRequestProblemVN?: string;
  nameRequestProblemEN?: string;
  nameRequestField?: string;
  status?: string;
  stt?: string;
  description?: string;
}
