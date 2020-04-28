import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class LogisticsCompanyService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/logistic_companies', true);
  }

  getLogisticCompany() {
    return this.get('');
  }

  getLogisticCompanyAvailable() {
    return this.get(`?status=Y`);
  }

  createNewLogisticCompany(company) {
    return this.post('', company);
  }

  updateLogisticCompany(company) {
    return this.put(`/${company.id}`, company);
  }

  deleteLogistic(logisticId) {
    return this.delete(`/${logisticId}`);
  }
}
