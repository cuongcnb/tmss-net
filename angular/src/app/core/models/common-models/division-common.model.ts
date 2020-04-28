import { BaseModel } from '../base.model';

export interface  DivisionCommonModel extends BaseModel {
  parentDivId?: string;
  divCode?: string;
  divName?: string;
  des?: string;
  managerId?: string;
  childOf?: string;
  children?: DivisionCommonModel [];
}
