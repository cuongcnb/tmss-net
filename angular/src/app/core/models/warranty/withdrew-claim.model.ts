import { BaseModel } from '../base.model';

export interface WithdrewClaimModel extends BaseModel {
  no?;
  dealerClaimNo?;
  submissionDate?;
  claimAmount?;
  judgeDate?;
  reasonDate?;
  modify?;
}
