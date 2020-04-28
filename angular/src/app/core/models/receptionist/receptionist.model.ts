import {BaseModel} from '../base.model';
import {DeskAdvisorModel} from '../catalog-declaration/desk-advisor.model';

export interface ReceptionistDeskAdviserModel extends DeskAdvisorModel {
  receivedQty?: number;
  waitingQty?: number;
  consultingCars?: Array<any>;
  waitingConsultCars?: Array<any>;
  consultedCars?: Array<any>;
  isOpen?: boolean;
  advisorTitle?: string;
}

export interface GuestWaitAssignModel extends BaseModel {
  registerNo?: string;
  inDate?: number;
  cusArr?: number;
  cusId?: number;
  vhcId?: number;
  floorId?: number;
  deskId?: number;
  advisorId?: number;
  customerName?: string;
  startMeetcusDate?: number;
  isFirstIn?: string;
  appType?: string;
  isAppointment?: string;
  modifyDate?: number;
  isService?: string;
}

export interface AppWaitAssignModel extends BaseModel {
  registerNo?: string;
  inDate?: number;
  cusArr?: number;
  cusId?: number;
  vhcId?: number;
  floorId?: number;
  deskId?: number;
  advisorId?: number;
  customerName?: string;
  startMeetcusDate?: number;
  isFirstIn?: string;
  isAppointment?: string;
  modifyDate?: number;
}

export interface AssignAdvisor {
  advisorId: number;
  currentModifyDate: number;
  gateInOutId: number;
  ordering: number;
}


export interface ReceptionistWaitAssign {
  guestWaitAssign: Array<GuestWaitAssignModel>;
  appWaitAssign: Array<AppWaitAssignModel>;
}

export interface WaitReceiveResponseModel extends BaseModel {
  registerNo: string;
  inDate: number;
  cusId: number;
  vhcId: number;
  floorId: number;
  deskId: number;
  advisorId: number;
  customerName: string;
  startMeetcusDate: number;
  isFirstIn: string;
  isAppointment?: string;
  modifyDate: number;
  ordering: number;
  assignDate: number;

}

export interface AdvisorVehicleReceivingModel extends BaseModel {
  registerNo: string;
  inDate: number;
  cusId: number;
  vhcId: number;
  floorId: number;
  deskId: number;
  advisorId: number;
  customerName: string;
  startMeetcusDate: number;
  isFirstIn: string;
  modifyDate: number;
}

export interface WarnWaitCarTime {
  warnWaitCarTime: number;
}
