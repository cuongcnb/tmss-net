import { BaseModel } from '../base.model';

export interface CarFamilyModel extends BaseModel {
  cfCode?: string;
  cfName?: string;
  cfType?: number;
}
