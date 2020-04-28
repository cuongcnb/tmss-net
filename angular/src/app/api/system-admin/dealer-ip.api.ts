import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class DealerIpApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/sys-dealer-ip', true);
  }

  getAllById(dlr) {
    return this.get(`/${dlr}`);
  }

  addDealerIp(obj) {
    return this.post(``, obj);
  }

  updateDealerIp(obj) {
    return this.put(``, obj);
  }

  deleteDealerIpById(id) {
    return this.delete(`/${id}`);
  }
}
