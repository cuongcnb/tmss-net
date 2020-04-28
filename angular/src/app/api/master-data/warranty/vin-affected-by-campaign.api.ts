import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../../base-api.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class VinAffectedByCampaignApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/campaignAffected');
  }

  getVinNoByCampaignId(campId, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    return this.post(`/campaign/${campId}`, paginationParams);
  }
}
