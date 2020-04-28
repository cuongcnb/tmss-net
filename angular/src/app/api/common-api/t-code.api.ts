import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class TCodeApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/tcode');
  }

  search(tCodeType, tcode?) {
    return this.get(`/search?tcodeType=${tCodeType}${tcode ? '&tcode=' + tcode : ''}`);
  }

  getPaintList() {
    return this.get('/paint-list');
  }
}
