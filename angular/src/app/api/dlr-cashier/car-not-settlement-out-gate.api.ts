import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class CarNotSettlementOutGateApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/in-out-gate');
  }

  searchInOutGate(data) {
    return this.post('/search', data);
  }

  printOutGate(requestInOutGate) {
    return this.download(`/print-out-gate`, requestInOutGate);
  }

  getDetail(vehicleId) {
    return this.get(`/vehicle/${vehicleId}`);
  }
}
