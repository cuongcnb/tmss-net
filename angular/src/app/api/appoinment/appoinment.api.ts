import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class AppoinmentApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/appoinment');
  }

  insertNew(data) {
    return this.post('/insert', data);
  }

  updateAppoinment(data) {
    return this.put('/update', data);
  }

  search(searchData) {
    return this.post('/search_appoinment', searchData);
  }

  printAppoinment(data) {
    return this.download('/print-appoinment', data);
  }

  cancelAppoinment(appId, isCofirm) {
    return this.put(`/cancel/${appId}?isAccept=${isCofirm}`);
  }

  hideAppoinment(data) {
    return this.put('/hide', data);
  }

  hideOrCancelAppoinment(data, status) {
    // status => 0: no-show, 1: cancel, 2: accept
    return this.put(`/hideOrCancel?status=${status}`, data);
  }

  change(data) {
    return this.put('/change', data);
  }

  findOne(id) {
    return this.get(`/getOne/${id}`);
  }

  isInCampaign(registerNo) {
    return this.get(`/is-in-campaign?registerNo=${registerNo}`);
  }

  getStatus(appointmentId) {
    return this.post(`/get-status?id=${appointmentId}`);
  }
}
