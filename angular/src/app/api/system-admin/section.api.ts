import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class SectionApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('', true);
  }

  refreshToken() {
    return this.get(`refresh`);
  }
}
