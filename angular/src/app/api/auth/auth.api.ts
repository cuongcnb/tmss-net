import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class AuthApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('', true);
  }

  login(data) {
    return this.post('auth', data);
  }

  getAvailableDealersByIp() {
    return this.get('dlrAvailableByIp');
  }

  getFunctionList(moduleName) {
    return this.post(`functions_list?module_name=${moduleName}`);
  }

  getAllFunctionList() {
    return this.post(`functions_list`);
  }

}
