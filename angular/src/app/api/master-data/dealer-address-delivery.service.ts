import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable({
  providedIn: 'root'
})
export class DealerAddressDeliveryService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/receive_address', true);
  }

  getList(dealerId?) {
    return this.get(dealerId ? `?dealer_id=${dealerId}` : '');
  }

  getAvailableList(dealerId?) {
    return this.get(dealerId ? `/available?dealer_id=${dealerId}` : `/available`);
  }

  createNewData(data) {
    return this.post('', data);
  }

  updateData(data) {
    return this.put('', data);
  }

  deleteDealerAddress(dealerAddressID) {
    return this.delete(`/${dealerAddressID}`);
  }
}
