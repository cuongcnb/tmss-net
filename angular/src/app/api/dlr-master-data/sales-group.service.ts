import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class SalesGroupService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/sales_group', true);
  }

  getSalesGroup(dealerId) {
    return this.post(`/find_by_dealer_id?dealerId=${dealerId}`);
  }

  getAvailableSaleGroup(dealerId) {
    return this.post(`/find_available_sales_group?dealerId=${dealerId}`);
  }

  createSalesGroup(sales) {
    return this.post('', sales);
  }

  updateSalesGroup(sales) {
    return this.put(`/${sales.id}`, sales);
  }

  deleteSaleGroup(saleGroupId) {
    return this.delete(`/${saleGroupId}`);
  }
}
