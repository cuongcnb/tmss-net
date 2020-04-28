import { BaseModel } from '../base.model';

export interface DealerOrderConfigModel extends BaseModel {
  name: string;
  dataType?: string;
  dealer?: string;
  dealerId: number;
  versionType: string;
  month?;
  deadline?;
}
