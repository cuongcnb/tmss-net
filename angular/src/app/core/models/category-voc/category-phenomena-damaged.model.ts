import { BaseModel } from '../base.model';

export interface CategoryPhenomenaDamagedModel extends BaseModel {
  nameComplainField?: string;
  nameComplainProblem?: string;
  namePartsDamaged?: string;
  codePhenomenaDamaged?: string;
  namePhenomenaDamagedVN?: string;
  namePhenomenaDamagedEN?: string;
  status?: string;
  stt?: string;
}
