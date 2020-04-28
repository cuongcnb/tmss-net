import { BaseModel } from '../base.model';

export interface NewPromotionModel extends BaseModel {
  isTitle?: string;
  isContent?: string;
  dateSubmit?: string;
  agencySubmit?: string;
  statusBrowser?: string;
}

