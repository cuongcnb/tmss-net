import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class MeansOfTransportationService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/mean_transportion', true);
  }

  getTransportMean() {
    return this.get('');
  }

  createNewTransportMean(means) {
    return this.post('', means);
  }

  updateTransportMean(means) {
    return this.put(`/${means.id}`, means);
  }

  deleteTransportMean(transportMeanId) {
    return this.delete(`/${transportMeanId}`);
  }
}
