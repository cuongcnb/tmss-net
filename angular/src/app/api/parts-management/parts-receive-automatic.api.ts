import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsReceiveAutomaticApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-receive');
  }

  getInvoices(searchData, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    searchData = Object.assign({}, searchData, paginationParams);
    return this.post(`/automatic/search`, searchData);
  }

  getPartByInvoice(id) {
    return this.post(`/automatic/search/part?id=${id}`);
  }

  getGHByInvoice(voucherId) {
    return this.get(`/automatic/view?voucherId=${ voucherId }`);
  }

  receive(data) {
    return this.post(`/automatic/receive`, data);
  }
}
