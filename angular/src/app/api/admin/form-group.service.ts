import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class FormGroupService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/list_group', true);
  }

  getGroups(formId) {
    return this.get(`/${formId}`);
  }

  getGroupsAvailable(formId) {
    return this.get(`/${formId}?status=Y`);
  }

  createNewGroup(group) {
    return this.post('', group);
  }

  updateGroup(group) {
    return this.put(`/${group.id}`, group);
  }
}

