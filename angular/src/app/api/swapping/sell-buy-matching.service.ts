import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class SellBuyMatchingService extends BaseApiSaleService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss', true);
  }

  getMatchedListData(searchData) {
    return this.post('/swapping_buy/search_tmv_mapping_sell_buy', searchData);
  }

  getData() {
    return this.get('/swapping_buy/tmv_buy_sell');
  }

  sortMatching(data) {
    return this.post('/swapping_sell/mapping', data);
  }

  sendDataMatching(data) {
    return this.post('/swapping_sell/save_mapping', data);
  }

  exportMatchingList() {
    return this.downloadByGet('/swapping_buy/export');
  }

}
