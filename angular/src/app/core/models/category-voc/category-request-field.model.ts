import { BaseModel } from '../base.model';

export interface CategoryRequestFieldModel extends BaseModel {
  codeRequestField?: string;
  nameRequestField?: string;
  nameRequestFieldVN?: string;
  nameRequestFieldEN?: string;
  status?: string;
  stt?: string;
  description?: string;
}
