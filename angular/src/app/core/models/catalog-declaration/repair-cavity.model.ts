import { BaseModel } from '../base.model';

export interface RepairCavityModel extends BaseModel {
  wsCode?: string;
  wsName?: string;
  description?: string;
  divId?: string;
  pic?: string;
  empId?: number;
  wsStatus?: string;
  wsTypeId?: number;
  listEmpID?: string;
  listEmp?: Array<any>;
}
