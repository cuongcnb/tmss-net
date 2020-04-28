import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';


@Injectable()
export class PartsRepairPositionPrepickApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-function/prepick-location-edit');
  }

  searchVourcher() {
    return this.post(`/search`);
  }
  searchParts(id) {
    return this.post(`/search-part?id=${id}`);
  }
}
