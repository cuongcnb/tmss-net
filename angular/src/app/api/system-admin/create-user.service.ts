import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { EnvConfigService} from '../../env-config.service';

@Injectable()
export class CreateUserService extends BaseApiService {

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

  getEmployee(dlrId) {
    return this.get(`/employee?dlrId=${dlrId}`);
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
}
