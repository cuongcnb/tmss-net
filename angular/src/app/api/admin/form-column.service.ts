import { Injectable, Injector } from '@angular/core';
import { BaseApiSaleService } from '../base-api-sale.service';
import { EnvConfigService} from '../../env-config.service';

@Injectable()
export class FormColumnService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/form_column', true);
  }

  getList(formId) {
    return this.get(`/${formId}`);
  }


  getListAvailable(formId) {
    return this.get(`/${formId}?status=Y`);
  }

  createNewList(dealer) {
    return this.post('', dealer);
  }

  updateList(dealer) {
    return this.put(`/${dealer.id}`, dealer);
  }
}

