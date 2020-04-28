import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class SwappingVehicleService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/swapping_vehicle', true);
  }

  headerSearch(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      sortType: null,
      page: 1,
      filters: [],
      size: 20,
      fieldSort: null
    };
    const searchBody = Object.assign(searchObj, paginationParams);
    return this.post('/search_swap_vehicle', searchBody);
  }

  addSwappingVehicle(swappingInfo) {
    return this.post('/add_swapping_veh', swappingInfo);
  }

  searchDealerToSwap(searchObj) {
    return this.post('/search_dealer_swap', searchObj);
  }

  sellSwapReport(searchObj) {
    return this.post('/sell_swap_report', searchObj);
  }

  approveSwapVehicle(selectedVehicle) {
    const data = {
      swapVehicleId: selectedVehicle.id,
      modifyDate: selectedVehicle.modifyDate
    };
    return this.put('/approve_swap_vehicle/', data);
  }

  rejectSwapVehicle(selectedVehicle) {
    const data = {
      swapVehicleId: selectedVehicle.id,
      modifyDate: selectedVehicle.modifyDate
    };
    return this.put('/reject_swap_vehicle', data);
  }
}
