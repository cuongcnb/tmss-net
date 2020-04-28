import { BaseModel } from '../base.model';

export interface FleetUnitModel extends BaseModel {
  min: number;
  max: number;
  available: number;
}
