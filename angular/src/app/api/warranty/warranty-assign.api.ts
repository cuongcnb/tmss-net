import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class WarrantyAssignApi extends  BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/warranty-master');
  }

  getWarrantyAssign() {
    return this.get(`/warranty-assign`);
  }

  removeWarrantyAssign(id) {
    return this.delete(`/warranty-assign/${id}`, );
  }

  saveWarrantyAssign(data) {
    return this.post('/warranty-assign', data);
  }
}
