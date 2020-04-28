import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from './base-api.service';
import {EnvConfigService} from '../env-config.service';

@Injectable()
export class HomeApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('');
  }

  getDataTable(paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const obj = Object.assign(paginationParams);

    return this.post('/queuing/home/waiting-receive', obj);
  }

  getData() {
    return this.get('/ro-wshop/home');
  }
}
