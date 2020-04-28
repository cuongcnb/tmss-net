import { BaseApiService } from '../base-api.service';
import { Injectable, Injector } from '@angular/core';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsReceiveHistoryApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/parts-receiving-history');
  }

  search(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchObj, paginationParams);
    return this.post('/search-header', searchBody);
  }

  getPartsOfOrder(selectedOrder) {
    return this.post('/search-detail', selectedOrder);
  }
}
