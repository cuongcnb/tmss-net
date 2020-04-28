import { BaseModel } from '../base.model';

export interface VinModel extends BaseModel {
  index?: number;
  plantLod?: string;
  vehicleType?: string;
  modelName?: string;
  vin?: string;
  regisCountry?: string;
  message?: string;
}
