import { BaseModel } from '../base.model';

export interface ProvincesModel extends BaseModel {
  code: string;
  name: string;
  population?: number;
  square?: number;
  region: string;
}
