import { BaseModel } from '../base.model';

export interface FleetSchemesModel extends BaseModel {
  min: number;
  max: number;
  available: number;
  fwsp: number;
  frsp: number;
  holdbackAmount?: number;
  discount?: number;
  marginPercent?: number;
  margin?: number;
  description?: string;
}
