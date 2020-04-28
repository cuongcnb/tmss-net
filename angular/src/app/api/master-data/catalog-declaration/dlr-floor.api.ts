import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../../base-api.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class DlrFloorApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/floor');
  }

  getByCurrentDealer(isAll = false) {
    return this.get(`/dealer${!isAll ? '?status=Y' : ''}`);
  }
}
