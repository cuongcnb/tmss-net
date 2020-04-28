import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { EnvConfigService } from '../../env-config.service';

@Injectable()
export class LexusReturnToDealerApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-receive');
  }

  getInvoices(searchData, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    searchData = Object.assign({}, searchData, paginationParams);
    return this.post(`/lexus_return/search`, searchData);
  }

  getPartByInvoice(id) {
    return this.post(`/lexus_return/search/part?id=${id}`);
  }

  return(data) {
    return this.post(`/lexus_return/return`, data);
  }
}
