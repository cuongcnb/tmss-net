import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../../base-api.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class InsuranceNewEmpApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/insurance-employee');
  }

  findInsuranceEmp(inrComId) {
    return this.get(`/find-employee/${inrComId}`);
  }
}
