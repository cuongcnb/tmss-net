import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class InvCusDApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/invcus-d');
  }

  getInvoiceDetail(invcusId) {
    return this.get(`/invcus/${invcusId}`);
  }
}
