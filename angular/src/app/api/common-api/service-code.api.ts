import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { PaginationParamsModel } from '../../core/models/base.model';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class ServiceCodeApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/service-codes');
  }

  getAll() {
    return this.get(`/all`);
  }

  geSrvCodeList(paginationParams: PaginationParamsModel, srvCode?, cmId?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    return this.get(`/get-warranty-srv-code-list/${paginationParams.page}/${paginationParams.size}/${cmId}${srvCode ? '?srvCode=' + srvCode : ''}`);
  }
}
