import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class ErrorCodeApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/error-code');
  }

  searchErrorCode(errorCode?) {
    return this.get(`/search${errorCode && errorCode.errorCode ? '?errCode=' + errorCode.errorCode : ''}`);
  }
}
