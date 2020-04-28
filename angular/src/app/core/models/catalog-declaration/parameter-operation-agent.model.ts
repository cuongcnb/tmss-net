import { BaseModel } from '../base.model';

export interface ParameterOperationAgentModel extends BaseModel {
  effDateFrom?: string;
  effDateTo?: string;
  dateSearch: number;

  coefficientJG?: string;
  coefficientP?: string;
  coeficientB?: string;
  cost?: string;
  footerDoc?: string;
  logLv?: string;
  logo?: string;
  taxJobs?: string;
  useprogress?: string;
  useprogressDs?: string;
  guessReceptionOrder?: string;

  restAmFrom?: string;
  restAmTo?: string;
  restPmFrom?: string;
  restPmTo?: string;

  wkAmFrom?: string;
  wkAmTo?: string;
  wkPmFrom?: string;
  wkPmTo?: string;

  splitTimeScc?: number;
  splitTimeDs?: number;
  splitTimeRx?: number;

  holidayDate: string;
}
