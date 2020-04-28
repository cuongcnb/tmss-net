import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsNonLexusOrderLexusApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/lexus');
  }

  getChildDealerOfLexus() {
    return this.get('/special/dlr');
  }

  searchOrder(searchParams) {
    return this.post('/special/search', searchParams);
  }

  searchPartOfOrder(selectedOrder) {
    return this.post(`/special/search/part?specialOrderId=${selectedOrder.id}`);
  }

  export(ids) {
    return this.post('/special/export', ids);
  }

  updateOrder(orderData) {
    return this.put('/special', orderData);
  }

  lexusOrderToTmv(data) {
    return this.post('/special/order-to-tmv', data);
  }
}
