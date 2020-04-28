import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class ProvincesService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/provinces', true);
  }

  getAllProvinces() {
    return this.get('');
  }


  getAllAvailableProvinces() {
    return this.get('/available');
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

