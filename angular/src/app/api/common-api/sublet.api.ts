import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class SubletApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/sublet-type');
  }

  getAll() {
    return this.get('/all');
  }
}
