import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class RoLackOfPartExportApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-export/lack-part');
  }

  search(searchObj) {
    return this.post('/search', searchObj);
  }

  export(idArr) {
    return this.post('/export', idArr);
  }
}
