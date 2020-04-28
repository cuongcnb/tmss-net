import { BaseModel } from '../base.model';

export interface FollowOrderModel extends BaseModel {
  stt?: string;
  fix?: string;
  license?: string;
  service?: string;
  eta?: string;
  invoice?: string;
  etaEarly?: string;
  ata?: string;
  time?: string;
  outDate?: string;
  inShop?: string;
  noteTmv?: string;
  noteAgency?: string;
  follow?: string;
}
