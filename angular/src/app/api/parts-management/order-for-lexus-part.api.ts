import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class OrderForLexusPartApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/lexus');
  }

  // Get dealer lexus dealer of current dealer.
  // To view dealer lexus of current dealer: Login TMV => TMV_Lexus => Quan Ly Dai Ly Dat Phu Tung Lexus && Danh sach Dai ly dat phu tung chuyen biet len Lexus
  getLexusOfCurrentDealer() {
    return this.get('/dealer/parent');
  }

  // Search lexus part for new order to lexus
  findPartForNewOrder(searchParams, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.post('/order/search/part', searchBody);
  }

  placeOrder(orderData) {
    return this.post('/order', orderData);
  }

  downloadFile(newCreatedOrder) {
    return this.download(`/order/report?orderId=${newCreatedOrder.id}`);
  }
}
