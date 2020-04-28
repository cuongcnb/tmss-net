import { BaseModel } from '../base.model';

export interface LaborrateModel extends BaseModel {
  dealercode: string;
  vnName: string;
  laborRate: number;
  descvn: string;
  pwrdlr: number;
  prr: number;
  freePm: number;
}
