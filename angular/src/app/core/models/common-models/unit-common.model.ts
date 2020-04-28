import { BaseModel } from '../base.model';

export interface UnitCommonModel extends BaseModel {
  modifiedBy;
  modifyDate;
  createdBy;
  createDate;
  status;
  dlrId;
  id;
  gId;
  unitCode;
  unitName;
  qty;
  orderw;
}
