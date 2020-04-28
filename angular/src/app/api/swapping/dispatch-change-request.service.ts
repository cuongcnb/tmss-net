import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable({
  providedIn: 'root'
})
export class DispatchChangeRequestService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/vehicle', true);
  }

  searchChangeDispatch(searchObj, filterDataList?, paginationParams?) {
    paginationParams = paginationParams || {
      sortType: null,
      page: 1,
      filters: [],
      size: 20,
      fieldSort: null
    };
    const searchBody = Object.assign(paginationParams, {filterData: filterDataList}, searchObj);
    return this.post('/search_change_dispatch', searchBody);
  }

  approveChangeDispatch(detailObj) {
    return this.post('/approve_change_dispatch', detailObj);
  }

  rejectChangeDispatch(detailObj) {
    return this.post('/reject_change_dispatch', detailObj);
  }

  newPlanChangeDispatch(detailObj) {
    return this.post('/new_plan_change_dispatch', detailObj);
  }
}
