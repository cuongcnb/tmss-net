import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { EnvConfigService } from '../../env-config.service';

@Injectable()
export class MipCalculateApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/mip');
  }

  search(dataSearch, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 100,
    };
    dataSearch = Object.assign({}, dataSearch, paginationParams);
    return this.post(`/calculation/search`, dataSearch);
  }

  calculate(month, year, data) {
    return this.post(`/calculation/calculate?month=${month}&year=${year}`, data);
  }

  save(month, year, dataSave) {
    return this.post(`/calculation/save?month=${month}&year=${year}`, dataSave);
  }

  exportMip(obj) {
    return this.download('/export-to-excel', obj);
  }
}
