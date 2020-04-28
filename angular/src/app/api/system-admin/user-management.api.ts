import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class UserManagementApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/auth');
  }

  getDataListInformation() {
    return this.get('/get-list-information');
  }

  getAuthMenuById() {
    return this.get('/get-menu');
  }

  getFunctionInformation() {
    return this.get('/get-function-information');
  }

  // group
  deleteGroup(obj) {
    return this.delete(`/group/${obj.groupId}`);
  }

  addGroup(obj) {
    return this.post('/group/add', obj);
  }

  updateGroup(obj) {
    return this.put('/group/update', obj);
  }

  getGroup(obj) {
    return this.post('/get-app-group-by-id', obj);
  }

  getFunctionGroup(obj) {
    return this.post('/get-function-group-by-id', obj);
  }

  getMenuGroup(obj) {
    return this.post('/get-menu-group-by-id', obj);
  }

  saveFunctionGroup(obj) {
    return this.post('/save-function-group', obj);
  }

  saveMenuGroup(obj) {
    return this.post('/save-menu-group', obj);
  }

  getUserInGroup(obj) {
    return this.post('/get-user-in-group', obj);
  }

  // users

  getUser(id) {
    return this.get(`/get-user-by-id/${id}`);
  }

  getGroupUser(obj) {
    return this.post('/get-user-group-by-id', obj);
  }

  saveUserGroup(obj) {
    return this.post('/save-user-group-by-id', obj);
  }

  addUser(obj) {
    return this.post('/user/add', obj);
  }

  updateUser(obj) {
    return this.put('/user/update', obj);
  }

  setPassword(obj) {
    return this.post('/user-set-password/update', obj);
  }

  getDataUser(user) {
    return this.post('/api', user);
  }
}
