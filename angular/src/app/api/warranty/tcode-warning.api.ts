import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class TcodeWarningApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/warranty-master');
  }

  getTCodeWarning() {
    return this.get('/tcode-warning');
  }

  deleteTCodeWarning(id) {
    return this.delete(`/tcode-warning/${id}`);
  }

  saveTCodeWarning(tCodeWarning) {
    return this.post('/tcode-warning', tCodeWarning);
  }
}

