import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsInStockAdjustmentApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part/adjust');
  }

  searchPartInStock(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign(searchObj, paginationParams);
    return this.post(`/search/type=${searchObj.type}`, searchBody);
  }

  searchPartHistory(partId) {
    return this.post(`/search/parts/${partId}`);
  }

  partAdjust(value, type) {
    return this.post(`/type=${type}`, value);
  }
}
