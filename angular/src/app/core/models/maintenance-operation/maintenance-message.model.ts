import { BaseModel } from '../base.model';

export interface MaintenanceMessageModel extends BaseModel {
  supplier?: string;
  bks?: string;
  vin?: string;
  remindDate?: string;
  toDate?: string;
  // thông tin xe
  licensePlate?: string;
  model?: string;
  estimatedDay?: string;
  vinno?: string;
  // thông tin khách hàng
  driversName?: string;
  driversAddress?: string;
  driversPhone?: string;
  driversEmail?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  carrierName?: string;
  carrierAddress?: string;
  carrierPhone?: string;
  carrierEmail?: string;
  // nội dung lần sửa gần nhất
  dateIn?: string;
  km?: string;
  milestonesBD?: string;
  expectedDateBD?: string;
  cvdv?: string;
  contentSC1?: string;
  // nội dung lần sửa gần nhất tại đại lý khác
  dateInContent?: string;
  kmContent?: string;
  contentSC2?: string;
  //
  numberSC?: string;
  dateCarIn?: string;
  dateCarOut?: string;
  technicians?: string;
  lhsc?: string;
  contentSC?: string;
}
