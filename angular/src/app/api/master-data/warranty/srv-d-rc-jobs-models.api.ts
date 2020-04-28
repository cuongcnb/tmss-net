import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../../base-api.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class SrvDRcJobsModelsApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/rc-job-model');
  }

  getAllDataForCar(obj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, obj, paginationParams);
    return this.post(`/dealer`, searchBody);
  }

  insertRcJobModel(obj, isBp?) {
    return this.post(`/insert-rc-jobs-models?isBp=${isBp}`, obj);
  }

  updateRcJobModel(obj, isBp?) {
    return this.put(`/update-rc-jobs-models/${obj.id}?isBp=${isBp}`, obj);
  }

  deleteRcJobModel(obj) {
    return this.delete(`/delete-rc-jobs-models/${obj.id}`);
  }

  getAllRcJobsData(data, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, data, paginationParams);
    return this.post('/get-all-jobs', searchBody);
  }

}
