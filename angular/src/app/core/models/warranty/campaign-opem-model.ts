import { BaseModel } from '../base.model';

export interface CampaignOpemModel extends BaseModel {
  campaignId?: number;
  description?: string;
  opemCode?: string;
  rcjId?: number;
}
