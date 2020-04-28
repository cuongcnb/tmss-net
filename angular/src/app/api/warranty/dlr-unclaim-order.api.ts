import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class DlrUnclaimOrderApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('');
  }

  search(searchData, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const dataRequest = Object.assign({}, searchData, paginationParams);
    return this.post('/un-claim/search', dataRequest);
  }

}
