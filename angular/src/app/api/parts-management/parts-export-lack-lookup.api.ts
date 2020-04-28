import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsExportLackLookupApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/parts-correction');
  }

  findRecv(searchData) {
    return this.post('/search-parts-receiving', searchData);
  }

  findRo(searchData) {
    return this.post('/search-ro-parts-header', searchData);
  }

  findRoDetail(searchData) {
    return this.post(`/search-ro-parts-detail`, searchData);
  }

  findRoBo(searchData) {
    return this.post(`/search-bo-parts-header`, searchData);
  }

  findRoDetailBo(searchData) {
    return this.post(`/search-bo-parts-detail`, searchData);
  }
}
