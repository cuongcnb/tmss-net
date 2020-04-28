import { BaseModel } from '../base.model';

export interface WorkGroupModel extends BaseModel {
  code?: string;
  name?: string;
  group?: string;
  note?: string;
  work: WorkModel[];
}

export interface WorkModel extends BaseModel {
  workCode?: string;
  workName?: string;
  roType?: string;
  internal?: string;
  hourPlan?: string;
  hourActual?: string;
  payment?: number;
  note?: string;
  total?: number;
  parts: PartOfWorkModel[];
}

export interface PartOfWorkModel extends BaseModel {
  partCode?: string;
  partName?: string;
  unit?: string;
  price?: number;
  // Tên phụ tùng, đơn giá, đơn vị, thuế
  tax?: number;
  amount?: number;
  payment?: number;
  note?: number;
  totalWithoutTax?: number;
  totalTax?: number;
  totalWithTax?: number;
}
