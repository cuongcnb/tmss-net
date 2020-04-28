import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class DlrVehicleInformationService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/vehicle', true);
  }

  searchDlrVehicleInfo(searchObj, filterDataList, paginationParams?) {
    paginationParams = paginationParams || {
      sortType: null,
      page: 1,
      filters: [],
      size: 20,
      fieldSort: null
    };
    const searchBody = Object.assign(paginationParams, {filterData: filterDataList}, searchObj);
    return this.post('/search_vehicle_info', searchBody);
  }

  changeAdvanceRequest(changeObj) {
    return this.post('/change_dispatch', changeObj);
  }
}
