import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class GroupColumnService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/group_column', true);
  }

  getColumns(groupId) {
    return this.get(`/${groupId}`);
  }

  getColumnsAvailable(groupId) {
    return this.get(`/${groupId}/available`);
  }

  createNewColumn(column) {
    return this.post('', column);
  }

  updateColumn(column) {
    return this.put(`/${column.id}`, column);
  }
}

