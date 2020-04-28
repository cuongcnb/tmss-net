import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../../base-api-sale.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class ModelApi extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/models', true);
  }

  getAvailableModel() {
    return this.get('/available');
  }
}
