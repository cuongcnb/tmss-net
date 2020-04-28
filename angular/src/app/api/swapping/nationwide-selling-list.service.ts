import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class NationwideSellingListService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/swapping_sell', true);
  }

  getAllSwappingSell(dealerId) {
    return this.get(`/${dealerId}`);
  }

  filterCommon(dealerId, filterObj) {
    return this.post(`/filter?dealer_id=${dealerId}`, filterObj);
  }

  searchNationWideSellingList(searchObj, filterDataList) {
    const searchBody = Object.assign(searchObj, {filter: filterDataList});
    return this.post('/search', searchBody);
  }

  addVehicleToSell(vehicleToSell) {
    return this.post('/add_to_sell', vehicleToSell);
  }

  removeVehicleToSell(vehicleToSell) {
    return this.post('/remove_from_sell', vehicleToSell);
  }

}
