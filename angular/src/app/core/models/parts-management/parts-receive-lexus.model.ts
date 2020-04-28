import { BaseModel } from '../base.model';

export interface PartsReceiveLexusModel extends BaseModel {
  createdBy?: number;
  deleteflag?: number;
  dlrId?: number;
  id?: number;
  locationno?: string;
  modifiedBy?: number;
  modifyDate?: string;
  netprice?: number;
  partsId?: number;
  partscode?: string;
  partsname?: string;
  partsrecvid?: number;
  qtyOrder?: number;
  qtyRecv?: number;
  qtyRecvact?: number;
  qtySell?: number;
  sellunitId?: number;
  seqdisplay?: string;
  unitId?: number;
  slDaNhan?: number;

}
