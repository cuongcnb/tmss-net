import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class CarModelApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/car-model');
  }

  // tslint:disable-next-line:variable-name
  getCarModelByCarFam(carFamId?, cm_type?) {
    let url = `/car-family?`;
    if (carFamId || carFamId === 0) {
      url += `&cf_id=${carFamId}`;
    }
    if (cm_type || cm_type === 0) {
      url += `&cm_type=${cm_type}`;
    }
    return this.get(url);
  }

  getCarModelByCFAndCmCode(cfId, cmCode) {
    let url = `/car-family?cf_id=${cfId}`;
    if (cmCode) {
      url += `&cm_code=${cmCode}`;
    }    
    return this.get(url);
  }

  getByCarFamilyType(cfType) {
    return this.get(`/car-family-type/${cfType}`);
  }

  searchByCarModelCode(dataSearch) {
    let url = `/search?&`;
    for (const key in dataSearch) {
      if (dataSearch[key] && key === 'model') {
        url += `${key}=${encodeURI(dataSearch[key])}`;
      }
    }
    return this.get(url);
  }
}
