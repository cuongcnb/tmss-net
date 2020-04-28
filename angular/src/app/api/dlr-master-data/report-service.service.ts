import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class ReportService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/common/report', true);
  }

  specialCase(reportInputData) {
    return this.download('/special_case', reportInputData);
  }

  vehicleDiffDelivery(reportInputData) {
    return this.download('/vehicle_diff_delivery', reportInputData);
  }

  vehicleNoDelivery(reportInputData) {
    return this.download('/vehicle_no_delivery', reportInputData);
  }
}
