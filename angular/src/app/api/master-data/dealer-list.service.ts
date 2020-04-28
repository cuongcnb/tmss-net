import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class DealerListService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/dealer', true);
  }

  getDealers() {
    return this.get('');
  }

  getDealerChild(id) {
    return this.get(`/${id}/findWithChild`);
  }

  getAvailableDealers() {
    return this.get('/available');
  }

  getParentDealerOnly() {
    return this.get('/parent_dlr');
  }

  getRelatedDealers(dealerId) {
    return this.get(`/${dealerId}/related`);
  }

  createNewDealer(dealer) {
    return this.post('', dealer);
  }

  updateDealer(dealer) {
    return this.put(`/${dealer.id}`, dealer);
  }
}

