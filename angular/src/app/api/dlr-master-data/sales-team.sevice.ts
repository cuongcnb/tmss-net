import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class SalesTeamSevice extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/sales_team', true);
  }

  getSalesTeam(groupId, status?: string) {
    const searchQuery = status ? `/search_group?group_id=${groupId}&status=${status}` : `/search_group?group_id=${groupId}`;
    return this.get(searchQuery);
  }

  getAllSalesTeam() {
    return this.get('');
  }

  createSalesTeam(sales) {
    return this.post('', sales);
  }

  updateSalesTeam(sales) {
    return this.put(`/${sales.id}`, sales);
  }

  deleteSaleTeam(saleTeamId) {
    return this.delete(`/${saleTeamId}`);
  }
}
