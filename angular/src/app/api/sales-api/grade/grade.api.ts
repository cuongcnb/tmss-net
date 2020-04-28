import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../../base-api-sale.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class GradeApi extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/grades', true);
  }

  getGradesByModel(modelId) {
    return this.get(`/${modelId}`);
  }
}
