import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class TruckService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/trucks', true);
  }

  getAllTrucksAvailable() {
    return this.get(`?status=Y`);
  }

  getAllTrucks() {
    return this.get(``);
  }

  getTrucks(companyId) {
    return this.get(`/${companyId}`);
  }

  createNewTruck(truck) {
    return this.post('', truck);
  }

  updateTruck(truck) {
    return this.put(`/${truck.id}`, truck);
  }

  deleteTruct(tructId) {
    return this.delete(`/${tructId}`);
  }
}
