import {BaseModel} from '../base.model';

export interface DispatchChangeRequestModel extends BaseModel {
  dealer?: string;
  grade?: string;
  color?: string;
  portEta?: string;
  tmssNo?: string;
  latestPlanLodCustomPlan?: string;
  allocationMonth?: string;
  latestDispatchPlan?: string;
  dispatchChangeRequest?: string;
  advanceRequest?: string;
  newDispatchPlan?: string;
  originalDispatchPlan?: string;
  status?: string;
  requestDate?: string;
  confirmDate?: string;
}
