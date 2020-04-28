import { BaseModel } from '../base.model';

export interface PartsReceiveModel extends BaseModel {
  id?: number;
  unitId?: number;
  orderId?: number;
  partsId?: number;
  partsCode?: string;
  partsName?: string;
  unit?: string;
  seqdisplay?: string;
  orderQty?: number;
  qty?: number;
  recvActQty?: number;
  recvQty?: number;
  price?: number;
  sumPrice?: number;
  rate?: number;
  locationNo?: string;
  slDaNhan?: number;
  //
  receivedQty?: string;
  receiveQty?: string;
  receiveActualQty?: string;

}
