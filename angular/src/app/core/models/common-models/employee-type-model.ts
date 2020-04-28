import { BaseModel } from '../base.model';

export interface EmployeeTypeModel extends BaseModel {
  des?: string;
  empTypeCode?: string;
  empTypeName?: string;
}
