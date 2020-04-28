import { BaseApiService } from '../base-api.service';
import { Injectable, Injector } from '@angular/core';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartShippingHistoryApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/parts-shipping-history');
  }

  searchPartsSummary(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchObj, paginationParams);
    return this.post('/search-summary', searchBody);
  }

  getDetail(reqType, reqId) {
    return this.get(`/search-detail/${reqType}/${reqId}`);
  }

  exportExcel(idArr) {
    return this.post('/export', idArr);
  }
}
