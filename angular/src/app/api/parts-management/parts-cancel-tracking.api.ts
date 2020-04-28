import { Injectable, Injector } from '@angular/core';

import { BaseApiService } from '../base-api.service';
import { PaginationParamsModel } from '../../core/models/base.model';
import { PartsCancelTrackingModel } from '../../core/models/parts-management/parts-cancel-tracking.model';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsCancelTrackingApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/parts-warning');
  }

  searchAll(paginationParams: PaginationParamsModel) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    return this.get(`/all/${paginationParams.page}/${paginationParams.size}`);
  }

  search(data, paginationParams: PaginationParamsModel) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const dataSearch = Object.assign({}, data, paginationParams);
    return this.post(`/search`, dataSearch);
  }

  mark(part: PartsCancelTrackingModel) {
    return this.post(`/marked`, part);
  }

  approve(part: PartsCancelTrackingModel) {
    return this.post(`/approved`, part);
  }

  exports(id) {

  }
}
