import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class ShopCommonApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/shop');
  }

  getShopByShopType(typeId) {
    return this.get(`/type/${typeId}`);
  }

  // khoang sửa chữa chung
  getAllSccShop() {
    return this.get('/scc');
  }

  getAllRxShop() {
    return this.get('/rx');
  }

  getAllDsShop() {
    return this.get('/ds');
  }

  saveWshop(accept, data) {
    return this.post(`/dealer?accept=${accept}`, data);
  }
}
