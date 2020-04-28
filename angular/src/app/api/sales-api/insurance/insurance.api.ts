import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../../base-api.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class InsuranceApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('', true);
  }

  getInsuranceCompanyProposal() {
    return this.get('service/insurance-company/find');
  }

  getAllInsuranceCompany() {
    return this.get('tmss/insurance');
  }

  getInsuranceCompanyAvailable() {
    return this.get(`tmss/insurance?status=Y`);
  }

  create(insurance) {
    return this.post('tmss/insurance', insurance);
  }

  update(insurance) {
    return this.put(`tmss/insurance/${insurance.id}`, insurance);
  }

  deleteInsuranceCompany(companyId) {
    return this.delete(`tmss/insurance/${companyId}`);
  }
}
