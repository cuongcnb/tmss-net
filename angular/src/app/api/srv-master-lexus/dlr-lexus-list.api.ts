import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class DlrLexusListApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/master-lexus');
  }

  doOrderToLexus(dlrId , status) {
    return this.get(`/order-to-lexus?dlrId=${dlrId}&status=${status}`);
  }
}
