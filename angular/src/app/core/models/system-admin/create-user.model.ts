import { BaseModel } from '../base.model';

export interface CreateUserModel extends BaseModel {
  dealerId: number;
  userName: string;
  fullUserName: string;
  password: string;
  confirmPassword: string;
  employeeId: number;
}

export interface GroupAssignmentModel extends BaseModel {
  groupName: string;
  groupId: number;
  description: string;
}
