import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../../base-api-sale.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class DealerApi extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/dealer', true);
  }

  getDealers() {
    return this.get('');
  }

  getAllAvailableDealers() {
    return this.get('/available');
  }

  // getAvailableDealersByIp() {
  //   return this.get('/dlrAvailableByIp');
  // }

  getRelatedDealers(dealerId) {
    return this.get(`/${dealerId}/related`);
  }

  getDealerNotLexus() {
    return this.get('/dealers-is-not-lexus');
  }

  getDealerLexus() {
    return this.get('/dealers-is-lexus');
  }
}
