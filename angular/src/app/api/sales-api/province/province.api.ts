import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../../base-api-sale.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class ProvinceApi extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/provinces', true);
  }

  getAllAvailableProvince() {
    return this.get('/available');
  }

  getAllAvailableProvinceOrder() {
    return this.get('/available-order-name');
  }

  getAllProvinces() {
    return this.get('');
  }

  createNewProvinces(province) {
    return this.post('', province);
  }

  updateProvince(province) {
    return this.put(`/${province.id}`, province);
  }

  deleteProvince(provinceId) {
    return this.delete(`/${provinceId}`);
  }

}
