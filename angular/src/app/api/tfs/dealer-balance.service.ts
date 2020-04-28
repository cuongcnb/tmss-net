import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class DealerBalanceService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/tfs', true);
  }

  getAllDealerBalance() {
    return this.get('');
  }

  changeDealerBalanceAmount(changeAmountObj) {
    return this.post('/change_amount', changeAmountObj);
  }
}
