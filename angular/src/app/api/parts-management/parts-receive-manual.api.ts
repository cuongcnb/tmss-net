import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';


@Injectable()
export class PartsReceiveManualApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-receive');
  }

  findManualOrder(dataSearch, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, dataSearch, paginationParams);
    return this.post(`/manual/search`, searchBody);
  }

  findNoneToyotaManualOrder(dataSearch, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, dataSearch, paginationParams);
    return this.post(`/non-toyota/search`, searchBody);
  }

  findPartsByManualOrder(id) {
    return this.post(`/manual/search/part?id=${id}`);
  }

  reveiveManual(data) {
    return this.post('/manual/receive', data);
  }
}
