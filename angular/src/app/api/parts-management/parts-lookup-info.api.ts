import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsLookupInfoApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-search');
  }

  searchParts(searchParams, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.post('/search', searchBody);
  }
}
