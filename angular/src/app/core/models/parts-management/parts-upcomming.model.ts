import { BaseModel } from '../base.model';

export interface PartsUpcommingModel extends BaseModel {
  partsCode?: string;
  partsId?: string;
  qty?: string;
  lotNo?: string;
  comeDate?: string;
}
