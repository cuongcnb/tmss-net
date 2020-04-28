import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { EnvConfigService } from '../../env-config.service';

@Injectable()
export class DlrConfigApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/dealer-config');
  }

  getByCurrentDealer() {
    return this.get(`/dealer`);
  }

  getCurrentByDealer() {
    return this.get(`/current`);
  }

  save(data) {
    return this.post(`/dealer`, data);
  }

  getImg(dlrConfigId) {
    return this.get(`/${dlrConfigId}/img`);
  }

  uploadNewImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.sendForm(`/image-upload`, formData).send().response;
  }


  getCurrentWorkTime(data, roType?) {
    if (roType) {
      return this.post(`/current_work_time?roType=${roType}`, data);
    } else {
      return this.post('/current_work_time', data);
    }
  }

  getWorkTime(obj) {
    return this.post('/work-time', obj);
  }
}
