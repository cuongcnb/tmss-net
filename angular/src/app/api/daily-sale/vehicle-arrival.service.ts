import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class VehicleArrivalService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/vehicle', true);
  }

  searchVehicleArrival(filterStartForm, searchObj?, filterDataList?, paginationParams?) {
    paginationParams = paginationParams || {
      sortType: null,
      page: 1,
      size: 20,
      filters: [],
      fieldSort: null
    };
    let filterVehicleArrivalInside = {
      filterDataList: filterDataList ? filterDataList : [],
      filterVehicleArrival: filterStartForm
    };

    if (paginationParams.page === 0) {
      paginationParams.page = 1;
    }
    filterVehicleArrivalInside = Object.assign({}, filterVehicleArrivalInside, paginationParams, searchObj);
    return this.post('/vehicle_arrival/search', filterVehicleArrivalInside);
  }

  paymentTypeTFS(vehicleId) {
    return this.get(`/get_price_vehicle/${vehicleId}`);
  }

  updateVehicleArrival(updateVehicleArrivalList) {
    return this.put('/update_vehicle_arrival', updateVehicleArrivalList);
  }

  checkChooseDeliveryAt(id) {
    return this.get(`/vehicleArival/checkDeliveryAt/${id}`);
  }

}
