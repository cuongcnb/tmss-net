import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class SoldVehicleMaintenanceApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/warranty');
  }

  search(searchData, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const dataRequest = Object.assign({}, searchData, paginationParams);
    return this.post(`/search-warranty-vehicle`, dataRequest);
  }

  // Update and Create Vehicle Info use this API
  updateSoldVehicleMaintenance(dataUpdate) {
    return this.put('/update-vehicle', dataUpdate);
  }

}
