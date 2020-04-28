import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class UserColumnService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/user_column', true);
  }

  // Get all columns of this user (get user from token) by group (get group by form)
  getColumns(data) {
    return this.post(`/system-columns`, data);
  }

  saveColumnRole(arrUserColumn) {
    return this.post('', arrUserColumn);
  }

  getColumnsAuthorize(formName) {
    return this.get(`/system-columns/${formName}`);
  }

  updateStateGroup(data) {
    return this.postWithoutFormatData('/update-state-group', data);
  }
}

