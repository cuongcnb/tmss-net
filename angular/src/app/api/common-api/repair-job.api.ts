import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class RepairJobApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl(`/repair-job`);
  }

  getByJobTypeAndCarModel(carModelId?, typeId?) {
    let requestParams = `/search?`;
    if (carModelId) {
      requestParams += `&cm_id=${carModelId}`;
    }
    if (typeId) {
      requestParams += `&type=${typeId}`;
    }
    return this.get(requestParams);
  }

  getRepairPartsByJob(rcjId, cmId, cfId) {
    return this.get(`/repair-parts/${rcjId}/${cmId}/${cfId}`);
  }

  createJobsGroup(obj) {
    return this.post('/jobgroup', obj);
  }

  searchJobsGroup(obj) {
    return this.post('/dealer', obj);
  }

  getJobsGroupDetail(obj) {
    return this.post('/job-group-detail', obj);
  }

  getJobsGroupQuotation(obj, paginationParams? ) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    return this.post('/job-group-detail-quotation', Object.assign(obj, paginationParams));
  }

  deleteJobGroup(id) {
    return this.delete(`/job-group-delete?rcjgId=${id}`);
  }

  getPart(rcjmId) {
    return this.get(`/get-part-by-rcjmid?rcjmId=${rcjmId}`);
  }
}
