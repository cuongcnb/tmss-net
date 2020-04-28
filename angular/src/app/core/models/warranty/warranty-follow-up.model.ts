import { BaseModel } from '../base.model';

// tslint:disable-next-line:no-empty-interface
export interface WarrantyFollowUpModel extends BaseModel {
  modelPic: string;
  saName: string;
  plateNo: string;
  dlrName: string;
  model: string;
  problem: string;
  cusComplainDate: Date;
  dlrJudgeDate: Date;
  reqTSDDate: Date;
  appointForGembia: Date;
  tsdJudgeDate: Date;
  dlrOrderPartDate: Date;
  etaDate: Date;
  appointForRepair: Date;
  repairFinishDate: Date;
  totalLT: number;
  remark: string;
  angryBird: any;
  status: number;
  byLT: number;
}
