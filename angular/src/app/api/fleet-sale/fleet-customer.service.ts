import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class FleetCustomerService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/fleet/fleet_customer', true);
  }

  getAllFleetCustomer() {
    return this.get('');
  }

  createNewFleetCustomer(fleetCustomer) {
    return this.post('', fleetCustomer);
  }

  updateFleetCustomer(fleetCustomer) {
    return this.put(`/${fleetCustomer.id}`, fleetCustomer);
  }
}
