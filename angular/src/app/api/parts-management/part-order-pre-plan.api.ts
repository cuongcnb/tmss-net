import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartOrderPrePlanApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part/pre-plan');
  }

  searchPrePlanOrder(searchParams) {
    return this.post('/search/plan', searchParams);
  }

  getPartsOfOrder(planId) {
    return this.post(`/search/part?planId=${planId}`);
  }

  createNewOrder(orderDetail) {
    return this.post('', orderDetail);
  }

  updateOrder(orderDetail) {
    return this.put('', orderDetail);
  }

  deleteOrder(planId) {
    return this.delete(`/plan?planId=${planId}`);
  }

  deletePartOfOrder(planId, partId) {
    return this.delete(`/part?planDetailId=${partId}&planId=${planId}`);
  }
}

