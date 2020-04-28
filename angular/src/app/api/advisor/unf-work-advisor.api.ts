import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { EnvConfigService } from '../../env-config.service';

@Injectable()
export class UnfWorkAdvisorApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/unfinished-work-of-advisor');
  }

  searchAppointment(dataSearch) {
    return this.post('/search-appointment-of-customer-in-day', dataSearch);
  }

  searchAppParts(appId) {
    return this.get(`/search-app-parts/${appId}`);
  }

  searchRoParts(roId) {
    return this.get(`/search-ro-parts/${roId}`);
  }

  searchUnfinishWork(dataSearch, condition) {
    return this.post(`/search-unfinished-work?showQuotation=${condition}`, dataSearch);
  }

  searchJob(id) {
    return this.get(`/search-quotation-jobs/${id}`);
  }
}
