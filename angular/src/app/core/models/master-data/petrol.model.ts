import { BaseModel } from '../base.model';

export interface PetrolModel extends BaseModel {
  id?;
  grade: string;
  quantity: number;
}
