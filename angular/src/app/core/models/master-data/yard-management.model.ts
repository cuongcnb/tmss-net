import { BaseModel } from '../base.model';

export interface YardModel extends BaseModel {
  id?;
  code: string;
  name: string;
  address?: string;
  yardLocation?: string;
  description?: string;
}

export interface LocationOfYardModel extends BaseModel {
  yardId: number;
  code: string;
  locationRow: string;
  description: string;
  yard: YardModel;
}

export interface RegionOfYardModel extends BaseModel {
  yardCode: string;
  name: string;
  noneAssignment: string;
  status: string;
  description: string;
}

export interface LocationAssignmentModel extends BaseModel {
  code: string;
  row: number;
  column: number;
  priority: number;
  area: string;
  description: string;
}
