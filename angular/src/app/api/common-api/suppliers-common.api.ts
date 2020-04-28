import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class SuppliersCommonApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/suppliers');
  }

  getActiveSupplier() {
    return this.get('/active');
  }

  getSuppliersByCurrentDealer() {
    return this.get('/dealer');
  }

  getSupplierByCreator() {
    return this.get('/byCreator');
  }
}
