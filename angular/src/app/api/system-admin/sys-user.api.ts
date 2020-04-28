import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class SysUserApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/sys_app_users', true);
  }

  getAllUser() {
    return this.get('/find_all_user');
  }

  getTMVUser() {
    return this.get('/find_tmv_user');
  }

  createNewUser(user) {
    return this.post('', user);
  }

  updateUser(users) {
    return this.put(`/${users.id}`, users);
  }

  updatePassword(users) {
    return this.put(`/change_pass/${users.id}`, users);
  }

  changePassword(obj) {
    return this.put(`/change-password`, obj);
  }

  getEmployeeByDealer(dealerId) {
    return this.get(`/employee?dlrId=${dealerId}`);
  }

  // Active InActive User
  changeStatusUser(user) {
    return this.put(`/change-status/${user.id}`, user);
  }
}
