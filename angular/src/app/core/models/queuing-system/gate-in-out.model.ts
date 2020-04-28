import { BaseModel } from '../base.model';

export interface GateInOutModel extends BaseModel {
  advisorId: number;
  createDate: string;
  cusId: number;
  customerName: string;
  deskId: number;
  floorId: number;
  isFirstIn: string;
  id: number;
  inDate: string;
  is1K: string;
  isAppointment: string;
  isBp: string;
  isGj: string;
  isMa: string;
  isReRepair: string;
  isService: string;
  isWarranty: string;
  modifyDate: string;
  outDate: string;
  registerNo: string;
  startMeetcusDate: string;
  vhcId: number;
}
