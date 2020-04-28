import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class VehicleConditionService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/vehicle/condition', true);
  }

  checkChooseVehicle(vehicleId) {
    return this.post(`/choose-vehicle/${vehicleId}`);
  }

  getMlPlanDeliveryDate(cbuCkd, vehicleId) {
    return this.get(`/ml_plan_delivery_date/${cbuCkd}/${vehicleId}`);
  }

}
