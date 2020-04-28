import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsCancelOrderRequestApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part/cancel-order');
  }

  searchOrder(searchParams, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.post('/search/order', searchBody);
  }

  cancelOrder(orderIdArr: Array<number>) {
    let request = '/send?';
    orderIdArr.forEach(id => {
      request = request.concat(`orderIds=${id}&`);
    });
    return this.post(request.substr(0, request.length - 1));
  }
}
