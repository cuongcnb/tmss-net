import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class FleetSchemesService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/fleet/fleet_grade', true);
  }

  getAllFleetSchemes() {
    return this.get('');
  }

  createNewFleetSchemes(fleetSchemes) {
    return this.post('', fleetSchemes);
  }

  updateFleetSchemes(fleetSchemes) {
    return this.put(`/${fleetSchemes.id}`, fleetSchemes);
  }
}
