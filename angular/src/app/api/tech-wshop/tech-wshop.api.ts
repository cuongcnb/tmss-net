import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class TechWshopApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/tech-wshop');
  }

  getTechWshopByDlr(roType) {
    return this.get(`/by-dealer?roType=${roType}`);
  }

  getTechByWshopId(wshopId, roType) {
    return this.get(`/by-wshop-id/${wshopId}?roType=${roType}`);
  }

  changeWshop(data) {
    return this.post('/change-wshop', data);
  }

  getEmpByWpId(wpId) {
    return this.get(`/emp_by_wpId/${wpId}`);
  }
}
