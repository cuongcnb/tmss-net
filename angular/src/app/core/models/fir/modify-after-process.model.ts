import { BaseModel } from '../base.model';

export interface ModifyAfterProcessModel extends BaseModel {
  supplier?: string;
  status?: string;
  code?: number;
  licensePlate?: string;
  driversName?: string;
  dateIn?: string;
  dateOut?: string;
  lsc?: string;
  lscType?: string;
  serviceAdvisor?: string;
  feedBack?: string;
  lslh?: string;

  dateContact?: string;
  timeContact?: string;
  contacter?: string;
  statusContact?: string;
  customerFeedBack?: string;
  reasonContactFail?: string;
  reasonNoContact?: string;

  feedBacker?: string;
  parts?: string;
  dateFeedBack?: string;
  statusContactCustomer?: string;
  dateContactCustomer?: string;
  timeContactCustomer?: string;
  reasonNotContact?: string;
  explainMisapprehend?: string;
  apologizeCustomer?: string;
  satisfied?: string;
  hailong?: string;
  agreeBack?: string;
  dateBack?: string;
  timeBack?: string;
  notBack?: string;
  reasonNotBack?: string;
  q1?: string;
  q2?: string;
  q3?: string;
  infoNonFIR?: string;

  errorCode?: string;
  coreReason?: string;
  preventiveMeasures?: string;
  processMeasures?: string;

  customerComeBack?: string;
  customerNotComeBack?: string;
  dateCustomerBack?: string;
  sLSC?: string;
  nameResolve?: string;
  repairContent?: string;

  statusSettlement?: string;
  statusSettlement1?: string;
}
