import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable({
  providedIn: 'root'
})
export class DealerGroupService extends BaseApiSaleService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/dealer_group', true);
  }

  getDealerGroupTable() {
    return this.get('');
  }

  getAvailableDealers() {
    return this.get('/available');
  }

  createDealerGroup(dealerGroup) {
    return this.post('', dealerGroup);
  }

  updateDealerGroup(dealerGroup) {
    return this.put(`/${dealerGroup.id}`, dealerGroup);
  }

  deleteDealerGroup(dealerGroupId) {
    return this.delete(`/${dealerGroupId}`);
  }
}
