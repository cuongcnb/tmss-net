import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class WarrantyFollowUpApi extends  BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/warranty-master');
  }

  getWarrantyFollowUp(data, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, data, paginationParams);
    return this.post('/search-warranty-follow-up', searchBody);
  }

  saveWarrFollowUp(body) {
    return this.post('/save-warranty-follow-up', body);
  }

  deleteWarrFollowUp(id) {
    return this.delete(`/warranty-follow-up/${id}`);
  }
}
