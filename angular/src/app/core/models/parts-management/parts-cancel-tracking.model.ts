import { BaseModel } from '../base.model';


export interface PartsCancelTrackingModel extends BaseModel {
  createdBy?: number;
  dlrId?: number;
  id?: number;
  issuesDate?: number;
  orderStr?: string;
  partsId?: number;
  partscode?: number;
  partsnamevn?: string;
  pwnNo?: string;
  pwnState?: number;
  qty?: number;
  reqId?: number;
  reqState?: string;
  reqtype?: number;
  status?: string;
  modifyDate?: number;
}
