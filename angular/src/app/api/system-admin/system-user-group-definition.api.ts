import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class SystemUserGroupDefinitionApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/group', true);
  }

  getAllSystemGroup() {
    return this.get('');
  }

  getAllActiveSystemGroup() {
    return this.get('/active');
  }

  addUserGroup(userGroupData) {
    return this.post('', userGroupData);
  }

  updateUserGroup(userGroupData) {
    return this.put('', userGroupData);
  }

}
