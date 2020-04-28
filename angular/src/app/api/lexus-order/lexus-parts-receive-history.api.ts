import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { EnvConfigService } from '../../env-config.service';

@Injectable()
export class LexusPartsReceiveHistoryApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-receive');
  }

  search(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchObj, paginationParams);
    return this.post('/lexus_receive_history/search', searchBody);
  }

  getPartByInvoice(id) {
    return this.post(`/lexus_receive_history/search/part?id=${id}`);
  }
}
