import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class LocationOfYardService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/yard_dealer', true);
  }

  findYardOfDealer(yardDealerHeaderForm) {
    return this.post('/find_yard_dealer', yardDealerHeaderForm);
  }

  createLocationOfYard(yard) {
    return this.post('', yard);
  }

  updateLocationOfYard(yard) {
    return this.put(`/${yard.id}`, yard);
  }
}
