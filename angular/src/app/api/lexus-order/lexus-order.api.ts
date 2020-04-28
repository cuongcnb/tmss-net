import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { Observable } from 'rxjs';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class LexusOrderApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/lexus-order');
  }

  showDetailOrders(searchData, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    searchData = Object.assign({}, searchData, paginationParams);
    return this.post(`/show-detail-orders`, searchData);
  }

  getLexusOrderSummaryHeader() {
    return this.get(`/automatically-receive-parts/get-summary-header`);
  }

  /*API nhận hàng*/
  doautomaticallyReceiveParts(data) {
    return this.post(`/automatically-receive-parts/do-receveive-order`, data);
  }

  getLexusOrderSummaryDetail(partsrecvid) {
    return this.get(`/automatically-receive-parts/get-summary-detail/${partsrecvid}`);
  }

}
