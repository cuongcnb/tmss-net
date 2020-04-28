import { BaseModel } from '../base.model';

export interface CashierModel extends BaseModel {
  appw?: number;
  cusId?: number;
  cusadd?: string;
  cusname?: string;
  custaxno?: string;
  dateClose?: number;
  debttotal?: number;
  dlrId?: number;
  dlrno?: number;
  fullmodel?: string;
  moneyBooking?: number;
  outgate?: boolean;
  outgatedate?: number;
  reason?: string;
  registerno?: string;
  roCreateBy?: string;
  roId?: number;
  roNum?: string;
  stt?: string;
}
