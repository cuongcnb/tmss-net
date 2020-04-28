import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../../base-api.service';
import { CampaignManagementModel, SearchCampaignModel } from '../../../core/models/warranty/campaign-management-model';
import { EnvConfigService} from '../../../env-config.service';

@Injectable()
export class CampaignManagementApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/campaign');
  }

  search(objSearch: SearchCampaignModel) {
    return this.post(`/search`, objSearch);
  }

  save(campaign: CampaignManagementModel) {
    return this.post(`/save`, campaign);
  }

  findJobByCampaignAndVinNo(campaignId, vinno, cmId) {
    const value = {
      campaignId: campaignId.toString(),
      vinNo: vinno,
      page: 1,
      size: 10000,
      cmId,
    };
    return this.post(`/find-jobs-campaign`, value);
  }
  getCampaignJobs(body) {
    return this.post('/get-campaign-jobs', body);
  }
  getCampaignParts(body) {
    return this.post('/get-campaign-parts', body);
  }
}
