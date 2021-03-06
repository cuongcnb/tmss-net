import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../../base-api.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class DealerIpConfigApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/dealer_ip_config', true);
  }

  getDealersIp() {
    return this.get('');
  }

  getDealerIpByDealerIp(dealerIp) {
    return this.get(`/${dealerIp}`);
  }

  createNewDealerIp(dealerIp) {
    return this.post('', dealerIp);
  }

  updateDealerIp(dealerIp) {
    return this.put(`/${dealerIp.id}`, dealerIp);
  }

  deleteDealerIp(dealerIp) {
    return this.delete(`/${dealerIp.id}`);
  }
}
