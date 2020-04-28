import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PetrolService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/petrol', true);
  }

  getPetrolTable(dealerId) {
    return this.get(`/${dealerId}`);
  }

  createNewPetrol(petrol) {
    return this.post('', petrol);
  }

  updatePetrol(petrol) {
    return this.put(`/${petrol.id}`, petrol);
  }

  deletePetrol(petrolId) {
    return this.delete(`/${petrolId}`);
  }
}
