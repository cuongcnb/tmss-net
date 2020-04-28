import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../../base-api.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class SrvDRcRepairPartsApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/rc-repair-parts');
  }

  insertRepairParts(obj) {
    return this.post('/insert-repair-parts', obj);
  }

  updateRepairParts(obj) {
    return this.put(`/update-repair-parts/${obj.id}`, obj);
  }

  deleteRepairParts(obj) {
    return this.delete(`/delete-repair-parts/${obj.rpId}`);
  }

}
