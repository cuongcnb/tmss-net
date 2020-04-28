import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';


@Injectable()
export class PartsReceiveManualLexusApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/lexus-order');
  }

  partOrderInfoSearchDTO(dataSearch, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, dataSearch, paginationParams);
    return this.post(`/manually-receive-parts/get-summary-header`, searchBody);
  }


  partsDetailByManualOrder(orderId) {
    return this.get(`/manually-receive-parts/get-summary-detail/${orderId}`);
  }

  reveiveManual(orderId, sVoucher, parts) {
    return this.post(`/manually-receive-parts/do-receveive-order/${orderId}/${sVoucher}`, parts);
  }
}
