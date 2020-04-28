import { BaseModel } from '../base.model';

export interface TransportTypeModel extends BaseModel {
  dlrId: number;
  transportCode: string;
  transportName: string;
}
