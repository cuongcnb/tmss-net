import { BaseModel } from '../base.model';

export interface PackOfPartModel extends BaseModel {
  deleteflag: string;
  efffrom: number;
  effto: number;
  partgroupprice: number;
  partsgroupcode: string;
  partsgroupname: string;
  pgDiscount: number;
  qty: number;
}

export interface PartOfPackModel extends BaseModel {
  coo: string;
  dlrName: string;
  expressShipping: number;
  fobPrice: number;
  fobUnit: string;
  frCd: string;
  genuine: string;
  handlemodel: string;
  kpiPartType: string;
  leadTime: number;
  localFlag: string;
  newPart: string;
  oldPart: string;
  partSize: string;
  partsCode: string;
  partsName: string;
  partsNameVn: string;
  partsSource: string;
  partsType: number;
  partsTypeName: string;
  pnc: string;
  price: number;
  rate: number;
  remark: string;
  sellPrice: number;
  sellUnit: string;
  sellUnitId: number;
  supplier: string;
  supplierId: number;
  unit: string;
  unitId: number;
}
