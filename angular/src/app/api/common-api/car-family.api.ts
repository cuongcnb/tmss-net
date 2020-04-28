import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class CarFamilyApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/car-family');
  }

  search(searchDTO) {
    return this.post('/search', searchDTO);
  }

  findAll() { // All of TMV
    return this.get('/all');
  }

  getByCFType(typeId) {
    return this.get(`/type/${typeId}`);
  }

  getByCarModelType(cmTypeId) {
    return this.get(`/cm-type/${cmTypeId}`);
  }
}
