import { BaseModel } from '../base.model';

export interface CustomerWaitingReceptionModel extends BaseModel {
  advisorId: number;
  empName: string;
  cusId: number;
  customerName: string;
  deskId: number;
  deskName: string;
  floorId: number;
  inDate: string;
  is1K: string;
  isAppointment: string;
  isBp: string;
  isGj: string;
  isMa: string;
  isReRepair: string;
  isService: string;
  isWarranty: string;
  outDate: string;
  registerNo: string;
  startMeetcusDate: string;
  vhcId: number;
}

export interface CustomerReceptingModel extends BaseModel {
  advisorId: number;
  empName: string;
  cusId: number;
  customerName: string;
  deskId: number;
  deskName: string;
  floorId: number;
  inDate: string;
  is1K: string;
  isAppointment: string;
  isBp: string;
  isGj: string;
  isMa: string;
  isReRepair: string;
  isService: string;
  isWarranty: string;
  outDate: string;
  registerNo: string;
  startMeetcusDate: string;
  vhcId: number;
}
