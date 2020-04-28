import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsManualOrderApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part/manual');
  }

  searchPartForNewOrder(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchObj, paginationParams);
    return this.post('/search/part', searchBody);
  }

  searchManualPart(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchObj, paginationParams);
    return this.post('/search/order', searchBody);
  }

  getPartsOfOrder(orderId, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const body = Object.assign(paginationParams, {orderId});
    return this.post('/order/part', body);
  }

  createNewOrder(orderData) {
    return this.post('/order', orderData);
  }

  downloadNewOrder(orderId) {
    return this.download(`/order/report?orderId=${orderId}`);
  }
}
