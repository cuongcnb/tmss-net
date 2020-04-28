import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class InsuranceEmployeeApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/insurance-employee');
  }

  getEmpByComId(id) {
    return this.get(`/find-employee/${id}`);
  }

  getEmpByname(dataSearch, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, dataSearch, paginationParams);
    return this.post('/find-employee-by-name', searchBody);
  }
}
