import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class ClaimStatusReportApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/warranty');
  }

  search(searchData, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const dataRequest = Object.assign({}, searchData, paginationParams);
    return this.post(`/search-claim`, dataRequest);
  }

  searchRepaireOrder(searchData, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const dataRequest = Object.assign({}, searchData, paginationParams);
    return this.post('/repair-order/search', dataRequest);
  }

  getStatusAll(val) {
    let url = '/all-dealer-status';
    if (val === 'tmv-dlr') {
      url = '/all-tmv-dlr-status';
    } else if (val === 'tmv-tmap') {
      url = '/all-tmv-tmap-status';
    }
    return this.get(url);
  }
}
