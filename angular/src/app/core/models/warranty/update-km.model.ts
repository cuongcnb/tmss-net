import { BaseModel } from '../base.model';

// tslint:disable-next-line:no-empty-interface
export interface UpdateKmModel extends BaseModel {
  dlrName: string;
  roNo: string;
  registerNo: string;
  vinno: string;
  km: string;
  meetCus: Date;
  openRoDate: Date;
}
