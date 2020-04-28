import { BaseModel } from '../base.model';

export interface ClaimStatusReportModel extends BaseModel {
  no?;
  dealerClaimNo?: string;
  brand?: string;
  warrantyType?: string;
  submitDate?: string;
  claimAmount?: string;
  adjustAmount?: string;
  reasonCode?: string;
  status?: string;
  errorCode1?: string;
  errorCode2?: string;
  errorCode3?: string;
  errorCode4?: string;
  errorCode5?: string;
  dlrStaffName?: string;
  distStaffName?: string;
  distManagerName?: string;
  distComment?: string;
  dlrComment?: string;
}
