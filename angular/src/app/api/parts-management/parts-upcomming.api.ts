import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';


@Injectable()
export class PartsUpcommingApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-function');
  }

  findUpcoming(dataSearch) {
    return this.post(`/prepare-come`, dataSearch);
  }

}
