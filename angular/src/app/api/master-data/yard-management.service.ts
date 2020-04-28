import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class YardManagementService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/yards', true);
  }

  getYards() {
    return this.get('');
  }

  getAvailableYards() {
    return this.get('/available');
  }

  createNewYard(yard) {
    return this.post('', yard);
  }

  updateYard(yard) {
    return this.put(`/${yard.id}`, yard);
  }

  deleteYard(yardId) {
    return this.delete(`/${yardId}`);
  }
}
