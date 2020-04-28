import { BaseModel } from '../base.model';

export interface WshopBPModel extends BaseModel {
  wsBPCode?: string;
  wsBPName?: string;
  description?: string;
  listEmpID?: string;
  listEmp?: Array<any>;
}
