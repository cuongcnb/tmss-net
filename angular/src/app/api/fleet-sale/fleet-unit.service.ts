import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class FleetUnitService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/fleet/fleet_unit', true);
  }

  getAllFleetUnit() {
    return this.get('');
  }

  createNewFleetUnit(fleetUnit) {
    return this.post('', fleetUnit);
  }

  updateFleetUnit(fleetUnit) {
    return this.put(`/${fleetUnit.id}`, fleetUnit);
  }
}
