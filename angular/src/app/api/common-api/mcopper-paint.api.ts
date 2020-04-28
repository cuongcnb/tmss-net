import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class McopperPaintApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/ds');
  }

  getListByDealer() {
    return this.get(`/dealer`);
  }

  addMCopperPaint(obj) {
    return this.post(`/dealer`, obj);
  }

  updateMCopperPaint(obj) {
    return this.put(`/dealer`, obj);
  }
}
