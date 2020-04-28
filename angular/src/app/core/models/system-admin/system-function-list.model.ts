import { BaseModel } from '../base.model';

export interface SystemFunctionListModel extends BaseModel {
  menuCode;
  menuName;
  menuDisplay;
  menuDescription;
  isParent;
}

export interface SystemParentFunctionModel extends BaseModel {
  menuName;
  menuLabel;
}
