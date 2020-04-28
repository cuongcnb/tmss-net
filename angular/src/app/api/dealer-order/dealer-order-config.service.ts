import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class DealerOrderConfigService extends BaseApiSaleService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/dealer_order_config', true);
  }

  getAll() {
    return this.get('');
  }

  search(dealerOrderConfigSearch) {
    return this.post('/search', dealerOrderConfigSearch);
  }

  createNewDealerOrderConfig(dealerOrderConfig) {
    return this.post('', dealerOrderConfig);
  }

  updateDealerOrderConfig(dealerOrderConfig) {
    return this.put(`/${dealerOrderConfig.id}`, dealerOrderConfig);
  }

  deleteDealerOrderConfig(DealerOrderConfigId) {
    return this.delete(`/${DealerOrderConfigId}`);
  }
}
