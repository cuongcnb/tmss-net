import { BaseModel } from '../base.model';

export interface PartsInfoManagementModel extends BaseModel {
  checkForExport?;
  partsTypeId: number;
  partsType;
  localFlag: number;
  partsCode: string;
  pnc: string;
  partsName: string;
  partsNameVn: string;
  price: number;
  unitId: number;
  unitCode: string;
  unit: string;
  sellPrice: number;
  sellUnitId: number;
  sellUnitCode: string;
  sellUnit: string;
  rate: number;
  supplierId: number;
  supplier;
  leadTime: number;
  kpiPartType;
  newPart;
  oldPart;
  handlemodel;
  frCd;
  partSize: number;
  expressShipping;
  coo;
  remark;
}

export interface PartHistoryInfo extends BaseModel {
  price;
  unit: string;
  sellPrice;
  sellUnit: string;
  effectiveFrom: string;
  effectiveTo: string;
}

export interface PartImportedModel extends BaseModel {
  bdirectshipping;
  bigPartFg;
  coo;
  createDate;
  createdBy;
  criternuminstock;
  deleteflag;
  dlrName;
  dlrId;
  expressShipping;
  fobPrice;
  fobUnit;
  frCd;
  genuine;
  handlemodel;
  handletype;
  id;
  kpiPartPcg;
  kpiPartRate;
  kpiPartType;
  localFlag;
  modifiedBy;
  modifyDate;
  ordering;
  orderunit;
  orderunitnum;
  partSize;
  partType;
  partsCode;
  partsName;
  partsNameVn;
  partsType;
  pnc;
  price;
  rate;
  remark;
  sellPrice;
  sellUnitId;
  specialclasscode;
  status;
  substitutioncode;
  substitutionpartno;
  substitutionpartnoOld;
  supplierId;
  unitId;
}
