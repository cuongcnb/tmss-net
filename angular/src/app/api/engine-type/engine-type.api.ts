import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class EngineTypeApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/engine-type');
  }

  getAllEngineByDlr(keyword?, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };

    if (keyword) {
      paginationParams = Object.assign(paginationParams, keyword);
    }
    return this.post('/dealer', paginationParams);
  }

}
