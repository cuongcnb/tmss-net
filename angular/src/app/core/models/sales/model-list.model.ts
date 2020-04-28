import { BaseModel } from '../base.model';

export interface ModelListModel extends BaseModel {
  id?;
  marketingCode: string;
  productionCode: string;
  enName: string;
  vnName: string;
  status: string;
  description: string;
}

export interface GradeListModel extends BaseModel {
  id?;
  marketingCode;
  productionCode?: string;
  enName: string;
  vnName?: string;
  cbucpk?: string;
  requestColor?: string;
  isHasAudio?: string;
  gasolineId?: number;
  flo_ID?: string;
  shortModel?: string;
  fullModel?: string;
  frnoLength?: string;
  order?: string;
}
