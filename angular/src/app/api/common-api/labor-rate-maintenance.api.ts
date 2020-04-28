import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class LaborRateMaintenanceApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/labor-rate-maintenance');
  }

  getLaborRateByDealer() {
    return this.get(`/dealer`);
  }

  getAll() {
    return this.get(`/`);
  }

  search(dealerCode) {
    return this.get(`/?dealercode=${dealerCode}`);
  }

  update(updateObj) {
    return this.put(`/update`, updateObj);
  }

  remove(id) {
    return this.delete(`/delete/${id}`);
  }
}
