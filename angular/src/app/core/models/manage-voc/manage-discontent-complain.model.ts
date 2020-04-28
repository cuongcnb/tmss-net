import { BaseModel } from '../base.model';


export interface ManageDiscontentComplainModel extends BaseModel {
  supplierReception: string;
  dateReception: string;
  toDateReception: string;
  licensePlate: string;
  status: string;
  dateFinish: string;
  toDateFinish: string;
  contacter: string;
  complainField: string;
  complainProblem: string;
  // info-complain
  dateCreate: string;
  // supplierReception: string;
  requestTMV: string;
  // dateReception: string;
  supplierSell: string;
  dateSendToTMV: string;
  sourceReception: string;
  supplierService: string;
  // status: string;
  //
  // contacter: string;
  driversName: string;
  driversPhone: string;
  specialCustomer: string;
  driversAddress: string;
  otherCustomerInfo: string;
  //
  vin: string;
  // licensePlate: string;
  carType: string;
  dateBuy: string;
  model: string;
  salesStaff: string;
  cvdv: string;
  salesTeam: string;
  technicians: string;
  km: string;
  techniciansTeam: string;
  //
  reasonComplain: string;
  solution: string;
  //
  severity: string;
  responsibility: string;
  reason: string;
  nonFix: string;
  complainRepeat: string;
  supportGoodwill: string;
  dateSuggest: string;
  dateApproved: string;
  detailGoodwill: string;
  // summary-evaluate
  // dateFinish: string;
  timeCollectInfo: string;
  timeNotCount: string;
  totalDate: string;
  evaluateSettlementTimeTrue: string;
  evaluateSettlementTimeFalse: string;
  reasonFail: string;
  //
  contentEXP: string;
  performEXP: string;
  //
  contactSuccess: string;
  contactFail: string;
  satisfied: string;
  reasonSatisfied: string;
  //
  handler: string;
  partRelate: string;
  staffSupport: string;
  necessaryInfo: string;
  reasonFailNecessary: string;
  modifyProcessFull: string;
  reasonFailModify: string;
  summaryFull: string;
  reasonFailSummary: string;
  clarityProblem: string;
  reasonFailClarity: string;
  failSupplierTrue: string;
  failSupplierFalse: string;
  tmvToSupplier: string;
}
