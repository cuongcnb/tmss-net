import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { BoOrderModel } from '../../core/models/parts-management/bo-parts-request.model';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class BoPartsOrderApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-bo/bo-order');
  }

  searchBoPart(type, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign(paginationParams, type);
    return this.post('/search', searchBody);
  }

  getCount(type, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign(paginationParams, type);
    return this.post('/search/count', searchBody);
  }

  getPartsOfOrder(reqId, type) {
    return this.post(`/search/detail?reqId=${reqId}&type=${type}`);
  }

  viewBoOrder(orderId, type) {
    return this.post(`/order?id=${orderId}&type=${type}`);
  }

  sendOrder(order: BoOrderModel, sendData) {
    const requestParams = `?id=${order.reqId}&ro=${order.ro}&type=${order.reqtype}`;
    return this.post(`/confirm-order${requestParams}`, sendData);
  }
}
