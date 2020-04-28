import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable({
  providedIn: 'root'
})
export class InsuranceCompanyService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/insurance', true);
  }

  getInsuranceCompanyAvailable() {
    return this.get(`?status=Y`);
  }

  getInsuranceCompanyTable() {
    return this.get('');
  }

  createNewInsurance(insurance) {
    return this.post('', insurance);
  }

  updateInsurance(insurance) {
    return this.put(`/${insurance.id}`, insurance);
  }

  deleteInsuranceCompany(companyId) {
    return this.delete(`/${companyId}`);
  }
}
