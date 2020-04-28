import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../../base-api.service';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class SrvDRcJobsApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/rc-job');
  }

  searchJobs(searchParams, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.post('/search', searchBody);
  }

  getJobs(cfId, cmId, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const obj = {
      cmId,
      cfId,
      page: paginationParams.page,
      size: paginationParams.size
    };
    return this.post(`/dealer`, obj);
  }


  insertJobForCar(data) {
    return this.post(`/insert`, data);
  }

  updateJobForCar(data) {
    return this.put(`/update/${data.id}`, data);
  }

  getAllRcJobsData(data, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, data, paginationParams);
    return this.post('/get-all-jobs', searchBody);
  }

  getDetailJobs(rcJobId, carModelId) {
    return this.get(`/${rcJobId}/car-model/${carModelId}`);
  }

  getAllListJob(obj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, obj, paginationParams);
    return this.post(`/gets`, searchBody);
  }

  getAllListJobByDlr(obj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, obj, paginationParams);
    return this.post(`/gets-by-dealer`, searchBody);
  }

  deleteJob(id) {
    return this.delete(`/delete/${id}`);
  }

}
