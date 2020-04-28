import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class VehicleApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/vehicle');
  }

  getVehicleOfCustomers(listCusId: Array<number>) {
    return this.post(`/customers`, {chainOfid: listCusId.toString()});
  }
}
