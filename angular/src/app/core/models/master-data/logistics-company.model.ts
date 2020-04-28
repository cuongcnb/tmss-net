import { BaseModel } from '../base.model';

export interface LogisticsCompanyModel extends BaseModel {
  code: string;
  vnName: string;
  enName: string;
  contactPerson: string;
  taxCode: number;
  bankNo: number;
  tel: string;
  fax: string;
  address: string;
}

export interface TrucksModel extends BaseModel {
  logisticsCode?: string;
  registerNo: string;
  meansOfTransportation: string;
  proYear: number;
  ownerType: string;
  driverName: string;
  driverPhone: string;
  description: string;
}
