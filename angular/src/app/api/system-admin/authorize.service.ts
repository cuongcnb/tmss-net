import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { EnvConfigService} from '../../env-config.service';

@Injectable()
export class AuthorizeService extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/authorize', true);
  }

  getAllFunctions() {
    return this.get('/functions');
  }

  getFuncOfGroup(groupId) {
    return this.get(`/group/${groupId}`);
  }

  saveFuncOfGroup(groupId, functionIds) {
    return this.post(`/group-menu/${groupId}`, functionIds);
  }

  getGroupByUserId(userId) {
    return this.get(`/user/${userId}`);
  }

  saveGroupOfUser(userId, data) {
    return this.post(`/group-user/${userId}`, data);
  }

  getFuncByMenuId(menuId) {
    return this.get(`/function/${menuId}`);
  }

}
