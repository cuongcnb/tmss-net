import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class SalesPersonService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/sales_person', true);
  }

  getSalesPerson(dealerId) {
    return this.get(`/${dealerId}`);
  }

  getAvailableSalesPerson(dealerId) {
    return this.get(`/${dealerId}/available`);
  }

  createSalesPerson(sales) {
    return this.post('', sales);
  }

  updateSalesPerson(sales) {
    return this.put(`/${sales.id}`, sales);
  }

  deleteSalesPerson(salePersonId) {
    return this.delete(`/${salePersonId}`);
  }
}
