import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class InvCusApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/invcus');
  }

  getInvoiceByCashier(cashierId) {
    return this.get(`/cashier/${cashierId}`);
  }

  createInvoice(data) {
    return this.post(`/insert`, data);
  }

  getInvoiceByRo(roId) {
    return this.get(`/ro/${roId}`);
  }
}
