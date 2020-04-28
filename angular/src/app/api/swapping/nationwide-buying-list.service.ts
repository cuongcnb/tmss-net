import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class NationwideBuyingListService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/swapping_buy', true);
  }

  getAllSwappingBuy(dealerId) {
    return this.get(`/${dealerId}`);
  }

  headerSearch(searchObj) {
    return this.post('/search', searchObj);
  }

  addNewBuyingList(buyingList) {
    return this.post('', buyingList);
  }

  deleteBuyingItem(swappingBuyId) {
    return this.put(`/delete/${swappingBuyId}`);
  }

  agreeBuyingItem(swappingBuyId) {
    return this.put(`/agree/${swappingBuyId}`);
  }

  disagreeBuyingItem(swappingBuyId) {
    return this.put(`/disagree/${swappingBuyId}`);
  }
}
