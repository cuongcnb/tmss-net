import { BaseModel } from '../base.model';

export interface DlrVehicleInfoModel extends BaseModel {
  isSell;
  swapDealer: string;
  swapDealerId: string;
  grade?: string;
  gradeId?: number;
  color?: string;
  colorId?: number;
  dealer?: string;
  dealerId: number;
  tmssNo?: string;
  cbuDocPlan?: string;
  latestLoPlanDate?: string;
  assAlloMonth?: string;
  status?: string;
  dispatchChangeReqDate?;
  advanceRequestDate?;
  newDispatchPlanDate?: string;
  originalDispatchPlanDate?: string;
  // dispatchChangeSendDate?: string;
  swapRequestDate?: string;
  dispatchChangeConfirmDate?: string;
  lineOffDate: string;
  salesDate: string;
  vehicleSwapOut;
  vehicleSwapIn;
}
