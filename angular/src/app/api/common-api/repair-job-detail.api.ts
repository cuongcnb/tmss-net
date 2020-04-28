import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class RepairJobDetailApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl(`/repair-job-d`);
  }

  getRepairJobByJobGroupAndCarModel(jobGroupId, carModelId) {
    return this.get(`/group/${jobGroupId}/car-model/${carModelId}`);
  }

  getRepairJobByJobGroup(jobGroupId) {
    return this.get(`/job-group/${jobGroupId}`);
  }

  saveJobIntoGroup(jobGroupId, listJob) {
    const data = {
      rcjgId: jobGroupId,
      listRcjId: listJob.map(job => job.id)
    };
    return this.post(`/job-group`, data);
  }
}
