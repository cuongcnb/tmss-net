import { BaseModel } from '../base.model';

export interface CategoryCarTypeModel extends BaseModel {
  codeCarType?: string;
  codeMarketing?: string;
  nameCarType?: string;
  description?: string;
  status?: string;
  stt?: string;
  // car model
  codeCarModel?: string;
  nameCarModel?: string;
  // specifications
  categoryParent?: string;
  nameCategory?: string;
}
