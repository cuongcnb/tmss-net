import { BaseModel } from '../base.model';

export interface ModelCarModel extends BaseModel {
  cfId?: string;
  cmCode?: string;
  cmName?: string;
  cmType?: number;
  cmYear?: string;
  doixe?: string;
}
