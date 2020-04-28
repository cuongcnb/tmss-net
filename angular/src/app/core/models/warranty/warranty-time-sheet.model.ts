import { BaseModel } from '../base.model';

export interface WarrantyTimeSheetModel extends BaseModel {
  dealerId?: string;
  dealercode?: string;
  descvn?: string;
  freePm?: string;
  laborRate?: string;
  lexusMaintenance?: string;
  prr?: string;
  pwrdlr?: string;
  updatecount?: string;
}
