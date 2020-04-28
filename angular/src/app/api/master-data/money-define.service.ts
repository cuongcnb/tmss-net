import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class MoneyDefineService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/money', true);
  }

  getAll() {
    return this.get('');
  }

  createNewData(data) {
    return this.post('', data);
  }

  updateData(data) {
    return this.put(`/${data.id}`, data);
  }

  getPrice(productId, colorId, interiorColorId?) {
    const interiorColorStr = interiorColorId ? `&interior_color_id=${interiorColorId}` : '';
    return this.get(`/get_price?grade_product_id=${productId}&color_id=${colorId}` + interiorColorStr);
  }

  deleteMoney(moneyId) {
    return this.delete(`/${moneyId}`);
  }
}
