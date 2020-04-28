import { BaseModel } from '../base.model';

export interface PartsOfJobModel extends BaseModel {
  cmId?: number;
  genuine?: string;
  gtypeCode?: string;
  jmodelId?: number;
  partsCode?: string;
  partsId?: number;
  partsName?: string;
  partsType?: string;
  prDlrId?: number;
  rcjId?: number;
  remark?: string;
  reqQty?: number;
  sellPrice?: number;
  tax?: string;
  total?: number;
  unitName?: string;
}
