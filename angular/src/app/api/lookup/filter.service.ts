import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class FilterService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/filter', true);
  }

  getFilterField(formName) {
    return this.get(`/${formName}`);
  }

  createNewFilter(filterDetail) {
    return this.post('/', filterDetail);
  }

  getSaveFilterDetail(userFilterId) {
    return this.get(`/detail_filter/${userFilterId}`);
  }

  deleteSavedFilter(userFilterId) {
    return this.delete(`/delete_detail_filter/${userFilterId}`);
  }
}
