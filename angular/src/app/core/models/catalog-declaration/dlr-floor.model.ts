import { BaseModel } from '../base.model';

export interface DlrFloorModel extends BaseModel {
  floorName?: string;
  type?: string;
  description?: string;
}
