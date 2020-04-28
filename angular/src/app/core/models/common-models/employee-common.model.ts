import {BaseModel} from '../base.model';

export interface EmployeeCommonModel extends BaseModel {
  employeeId: number;
  id: number;
  titleCode: string;
  titleName: string;
  birthday?: number;
  divId?: number;
  email?: string;
  empAddress?: string;
  empCode?: string;
  empColor?: string;
  empImg?: string;
  empName?: string;
  sex?: number;
  startDate?: number;
  status?: string;
  tel?: string;
  titleId?: number;
  typeId?: number;
  deleteFlag?: string;
  typeJob?: string;
  url?: string;
  empId?: number;
}
