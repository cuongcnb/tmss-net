import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class CustomerService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/customer', true);
  }

  getChangeInformations() {
    return this.get('/change_information');
  }

  approveChangeInformation(customerId, data) {
    return this.put(`/change_information/approve/${customerId}`, data);
  }

  rejectChangeInformation(customerId) {
    return this.put(`/change_information/reject/${customerId}`);
  }

  searchChangeInformation(searchObj) {
    let searchQuery = '/change_information/search?';
    for (const key in searchObj) {
      if (searchObj[key]) {
        searchQuery += `&${key}=${searchObj[key]}`;
      }
    }
    searchQuery = searchQuery === '/change_information/search?' ? searchQuery.replace('?', '') : searchQuery.replace('&', '');
    return this.get(`${searchQuery}`);
  }

}
