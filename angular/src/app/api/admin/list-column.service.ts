import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class ListColumnService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/list_column', true);
  }

  getList() {
    return this.get('');
  }

  getListAvailable() {
    return this.get(`?status=Y`);
  }

  createNewList(dealer) {
    return this.post('', dealer);
  }

  updateList(dealer) {
    return this.put(`/${dealer.id}`, dealer);
  }
}

