import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../../base-api-sale.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class DistrictApi extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/districts', true);
  }

  getDistrictOfProvince(provinceId) {
    return this.get(`/${provinceId}?status=${true}`);
  }

  getDistrictOfProvinceOrder(provinceId) {
    return this.get(`/order-name/${provinceId}`);
  }

  createNewDistrict(district) {
    return this.post('', district);
  }

  updateDistrict(district) {
    return this.put(`/${district.id}`, district);
  }

  deleteDistrict(districtId) {
    return this.delete(`/${districtId}`);
  }

}
