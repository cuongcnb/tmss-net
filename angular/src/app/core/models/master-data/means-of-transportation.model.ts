import { BaseModel } from '../base.model';

export interface TransportationModel extends BaseModel {
  name: string;
  description: string;
  logo: string;
}

export interface TransportationTypeModel extends BaseModel {
  name: string;
  description: string;
}
