import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class SubletTypeMaintenanceApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/warranty-master');
  }

  getSubletType() {
    return this.get('/sublet-type');
  }

  saveSubletType(subletType) {
    return this.post('/sublet-type', subletType);
  }

  removeSubletType(id) {
    return this.delete(`/sublet-type/${id}`);
  }
}
