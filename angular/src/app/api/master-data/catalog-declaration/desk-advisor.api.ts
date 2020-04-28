import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../../base-api.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class DeskAdvisorApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/advisor');
  }

  getDeskByCurrentDealer(isActive = false) {
    return this.get(`/dealer${isActive ? '?status=Y' : ''}`);
  }

  getAllDeskByDlr(searchObj, paginationParams?, isActive?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    paginationParams = Object.assign(paginationParams, searchObj);
    return this.post(`/dealer${isActive ? '?status=Y' : ''}`, paginationParams);
  }
}
