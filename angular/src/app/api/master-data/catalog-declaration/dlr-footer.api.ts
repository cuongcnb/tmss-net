import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../../base-api.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class DlrFooterApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/footer');
  }

  getAllReportType() {
    return this.get('/type');
  }

  getFooterDetail(dealerId, typeId) {
    return this.get(`/dealer/${dealerId}/type/${typeId}`);
  }

  saveFooterTmv(typeId, data) {
    return this.post(`/type/${typeId}/footerTmv`, data);
  }

  saveFooterDealer(typeId, data) {
    return this.post(`/type/${typeId}/footer`, data);
  }
}
