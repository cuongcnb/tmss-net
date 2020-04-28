import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class CustomerDetailApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/customer-detail');
  }

  getDriverList(customerId) {
    return this.post(`/drivers?customerId=${customerId}`);
  }

  // Chuẩn hóa thông tin khách hàng
  getCusDetail(cusId) {
    return this.get(`/${cusId}`);
  }

  getMoreCusDetail(listCusId: Array<number>) {
    return this.post(`/customers`, {chainOfid: listCusId.toString()});
  }
}
