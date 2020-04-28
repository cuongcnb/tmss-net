import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class VehicleHistoryApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/jobbr-reason');
  }

  getVehicleHistory(data) {
    return this.post('/pendding-his', data);
  }

  add(obj) {
    return this.post('', obj);
  }

  getUnexpectJob(roId) {
    return this.get(`/by-ro-id/${roId}`);
  }

  verifyRequest(data) {
    return this.post('/verify-request', data);
  }
}
