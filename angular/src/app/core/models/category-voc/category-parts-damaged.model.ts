import { BaseModel } from '../base.model';

export interface CategoryPartsDamagedModel extends BaseModel {
  nameComplainField?: string;
  nameComplainProblem?: string;
  codePartsDamaged?: string;
  namePartsDamagedVN?: string;
  namePartsDamagedEN?: string;
  status?: string;
  stt?: string;
}
