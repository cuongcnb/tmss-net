import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable({
  providedIn: 'root'
})
export class CheckLogVehiclesService extends BaseApiSaleService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/vehicle', true);
  }

  searchCheckLogVehicles(searchKey, paginationParams) {
    paginationParams = paginationParams || {
      sortType: null,
      page: 1,
      filters: [],
      size: 20,
      fieldSort: null
    };
    const searchBody = Object.assign(paginationParams, {searchKey});
    return this.post('/get_check_logs_vehicles', searchBody);
  }
}
