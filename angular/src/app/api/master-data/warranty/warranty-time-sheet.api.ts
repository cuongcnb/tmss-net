import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../../base-api.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class WarrantyTimeSheetApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/labor-rate-maintenance');
  }

  create(saveObj) {
    return this.post(`/save`, saveObj);
  }

  update(updateObj) {
    return this.put(`/update`, updateObj);
  }

}
