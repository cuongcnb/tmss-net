import { BaseModel } from '../base.model';
import { CampaignOpemModel } from './campaign-opem-model';

export interface CampaignManagementModel extends BaseModel {
  campaignName?: string;
  campaignType?: string;
  description?: string;
  effectFrom?: string;
  effectTo?: string;
  listCamOpem?: Array<CampaignOpemModel>;
  worksCode?: string;
  refNo?: string;
  sortName?: string;
}

export interface SearchCampaignModel {
  campaignName?: string;
  from?: string;
  to?: string;
  rCode?: string;
}
