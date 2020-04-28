import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class DealerVersionTypeService extends BaseApiSaleService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/dealer_version_type', true);
  }

  getAll() {
    return this.get('');
  }

  createNewDealerVersionType(dealerVersionType) {
    return this.post('', dealerVersionType);
  }

  updateDealerVersionType(dealerVersionType) {
    return this.put(`/${dealerVersionType.id}`, dealerVersionType);
  }

  deleteDealerVersionType(DealerVersionTypeId) {
    return this.delete(`/${DealerVersionTypeId}`);
  }
}
