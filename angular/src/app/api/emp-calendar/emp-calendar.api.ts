import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class EmpCalendarApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/emp-calendar');
  }

  getNotWorkEmployee() {
    return this.get('/not-work');
  }

  insertNotWorkEmp(data) {
    return this.post('/insert', data);
  }

  updateEmpNotWork(data) {
    return this.put(`/update/${data.id}`, data);
  }

}
