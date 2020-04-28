import { BaseModel } from '../base.model';

export interface CategoryComplainFieldModel extends BaseModel {
  codeComplainField?: string;
  nameComplainField?: string;
  nameComplainFieldVN?: string;
  nameComplainFieldEN?: string;
  status?: string;
  stt?: string;
  description?: string;
}
