import { BaseModel } from '../base.model';

export interface CustomerInfoModel extends BaseModel {
  custypeId?: number;
  cusTypeId?: number;
  cusno?: string;
  carownername?: string;
  carowneridnum?: number;
  carowneradd?: string;
  carownertel?: number;
  carownermobil?: number;
  carownerfax?: string;
  carowneremail?: string;
  taxcode?: string;
  bankId?: number;
  accno?: string;
  cusVerify?: string;
  cusMrs?: string;
  deleteflag?: string;
  orgname?: string;
  calltime?: string;
  curFir?: string;
  cusContact?: string;
  provinceId?: number;
  districtId?: number;
  salesCustormerId?: number;
  relativesName?: string;
  relativesAddress?: string;
  relationshipId?: number;
  relativesProId?: number;
  relativesPhone?: number;
  cusIdString?: number;
}

export interface CusDetailModel extends BaseModel {
  address?: string;
  calltime?: string;
  cusDIdString?: string;
  cusId?: number;
  cusVerify?: string;
  deleteflag?: string;
  email?: string;
  idnumber?: number;
  mobil?: number;
  name?: string;
  status?: string;
  tel?: number;
  type?: string;
}

export interface VehicleOfCusModel extends BaseModel {
  cmCode?: string;
  enginecode?: string;
  engineno?: string;
  frameno?: string;
  registerno?: string;
  vcCode?: string;
  vinno?: string;
}

export interface LscOfCusModel extends BaseModel {
  carowneradd?: string;
  carownermobil?: number; // Di động
  carownername?: string;
  carownertel?: number; // Số điện thoại
  cusvsId?: number;
  inrstate?: string;
  registerNo?: string;
  repairOrderNo?: string;
  reqdesc?: string;
  roState?: string;
  roType?: string;
}

