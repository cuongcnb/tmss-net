import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsSpecialOrderApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part/special');
  }

  searchSpecialOrder(searchParams) {
    return this.post(`/search`, searchParams);
  }

  getPartsOfOrder(orderId) {
    return this.post(`/search/part?specialOrderId=${orderId}`);
  }

  updateOrder(orderData) {
    return this.put('', orderData);
  }

  deletePartOfOrder(orderId, partId) {
    return this.delete(`/part?id=${partId}&orderId=${orderId}`);
  }

  export(orderIdArray) {
    return this.post('/export', orderIdArray);
  }
}
