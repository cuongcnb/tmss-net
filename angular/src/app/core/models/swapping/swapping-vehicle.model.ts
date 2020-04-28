import {BaseModel} from '../base.model';

export interface SwappingVehicleModel extends BaseModel {
  status?: string;
  gradeSo?: string;
  colorSo?: string;
  tmssNoSo?: string;
  dlrDispatchPlanSo?: string;
  alloMonthSo?: string;
  dealer?: string;
  swapDealer?: string;
  gradeSi?: string;
  colorSi?: string;
  portEta?: string;
  tmssNoSi?: string;
  dlrDispatchPlanSi?: string;
  alloMonthSi?: string;
  kindOfSwap?: string;
}
