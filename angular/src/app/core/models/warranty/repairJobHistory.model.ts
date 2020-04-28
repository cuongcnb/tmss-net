import { BaseModel } from '../base.model';

export interface RepairJobHistoryModel extends BaseModel {
  vinNo?;
  warrantyChangeAmount?;
  warrantyRoHistory?;
  srvMDealer?;
  vwarrantyLaborDetails?;
  vwarrantyPartsDetails?;
}
