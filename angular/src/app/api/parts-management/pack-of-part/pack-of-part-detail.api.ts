import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../../base-api.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class PackOfPartDetailApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/parts-group-detail');
  }

  getPartOfPack(packId) {
    return this.get(`/parts/${packId}`);
  }
}
