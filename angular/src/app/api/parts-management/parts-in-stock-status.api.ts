import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsInStockStatusApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part/in-stock');
  }

  searchPartInStock(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, searchObj, paginationParams);
    return this.post(`/search`, searchBody);
  }

  updatePart(data) {
    return this.put('', data);
  }

  exportExcel(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, searchObj, paginationParams);
    return this.download(`/report`, searchBody);
  }
}
