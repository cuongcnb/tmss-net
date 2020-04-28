import { BaseModel } from '../base.model';

export interface TitleModel extends BaseModel {
  description?: string;
  empTypeId?: string;
  titleCode?: string;
  titleName?: string;
}
