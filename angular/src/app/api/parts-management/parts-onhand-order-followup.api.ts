import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsOnhandOrderFollowupApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part');
  }

  search(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchObj, paginationParams);
    return this.post('/inventory-info', searchBody);
  }

  cancelPart(partIdArr) {
    return this.post('/cancel-part', partIdArr);
  }
}
