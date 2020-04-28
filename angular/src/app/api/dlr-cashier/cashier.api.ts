import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { EnvConfigService } from '../../env-config.service';

@Injectable()
export class CashierApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/cashier');
  }

  search(searchData?, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };

    const dataRequest = Object.assign({}, searchData, paginationParams);
    return this.post('/search', dataRequest);
  }

  refreshInvoice() {
    return this.post('/refresh');
  }

  checkResidualRO(cashierId) {
    return this.get(`/check-out-gate/${cashierId}`);
  }

  getCashierRO(roId, cusvsId) {
    return this.get(`/ro-no-settlement/${roId}/cus-visit/${cusvsId}`);
  }

  printInvoice(invcusId, extension, isRecord?) {
    return this.download(`/print-invcus`, { invcusId, extension, isRecord });
  }

  printOutGate(casOutGate) {
    /* casOutGate {
      "appw": 0, // 0: khi click và in được ngay trên màn; 1: click vào nút in trong popup
      "cashierId": 0,
      "cusId": 0,
      "reason": "string",
      "ro_id": 0
    } */
    return this.download(`/print-outgate`, casOutGate);
  }

  getLaborAndMaterialCost(roId) {
    return this.get(`/ro-cost/${roId}`);
  }
}
