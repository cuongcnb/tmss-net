import { BaseModel } from '../base.model';

export interface CustomerTypeModel extends BaseModel {
  cusTypeCode: string;
  cusTypeName: string;
}
