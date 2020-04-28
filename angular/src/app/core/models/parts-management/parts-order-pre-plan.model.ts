import { BaseModel } from '../base.model';

export interface PartsOrderPrePlanModel extends BaseModel {
  createdDate: number;
  createdPerson: string;
  planName: string;
  planNo: string;
  remark: string;
  status: number;
  statusName: string;
  sumPrice: number;
}

export interface PartsOfPrePlanOrderModel extends BaseModel {
  partsCode: string;
  partsName: string;
  unit: string;
  qtyDlr: number;
  price: number;
  sumPrice: number;
  rate: number;
  expectDlrDate: number;
  remarkDlr: string;
  promiseTmvDate: number;
  qtyTmv: number;
  remarkTmv: string;
  partsId: number;
  prePlanDId: number;
  prePlanId: number;
  unitId: number;
}
