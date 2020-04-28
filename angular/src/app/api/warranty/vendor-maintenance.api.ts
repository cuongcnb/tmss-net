import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class VendorMaintenanceApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/warranty-master');
  }

  // searchVendorMaintenance(searchData, paginationParams?) {
  //   paginationParams = paginationParams || {
  //     page: 1,
  //     size: 20,
  //   };
  //   const dataRequest = Object.assign({}, searchData, paginationParams);
  //   return this.post(`/vendor-maintenance`, dataRequest);
  // }

  getVendorMaintenanceApi() {
    return this.get('/vendor-maintenance');
  }

  // Update and Create Vehicle Info use this API
  saveVendorMaintenance(dataUpdate) {
    return this.put('/vendor-maintenance', dataUpdate);
  }

  deleteVendorMaintenance(id) {
    return this.delete(`/vendor-maintenance/${id}`);
  }
}
