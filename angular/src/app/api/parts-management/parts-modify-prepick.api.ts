import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';


@Injectable()
export class PartsModifyPrepickApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-export');
  }

  search(keySearch) {
    return this.get(`/modify-part-prepick?keySearch=${keySearch ? encodeURI(keySearch) : ''}`);
  }

  searchDetail(reqId, reqtype) {
    return this.get(`/modify-part-prepick/${reqId}?reqtype=${reqtype}`);
  }

  saveLocation(data) {
    return this.put(`/modify-part-prepick`, data);
  }
}
