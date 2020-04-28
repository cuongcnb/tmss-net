import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class BpGroupApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/bp-group');
  }

  getBpGroups() {
    return this.get('/get');
  }

  createBpGroup(data) {
    return this.post('/insert', data);
  }

  deleteBpGroup(id) {
    return this.delete(`/delete/${id}`);
  }

  getBpGroup(id) {
    return this.get(`/get-one/${id}`);
  }

  updateBpGroup(bpGroup) {
    return this.put(`/update/${bpGroup.id}`, bpGroup);
  }

}
