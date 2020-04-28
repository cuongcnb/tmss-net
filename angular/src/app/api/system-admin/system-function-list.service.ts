import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { EnvConfigService} from '../../env-config.service';

@Injectable()
export class SystemFunctionListService extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/menu', true);
  }

  createNewMenu(data) {
    return this.post('', data);
  }

  getAll() {
    return this.get('');
  }

  updateMenu(menu) {
    return this.put(`/${menu.menuId}`, menu);
  }

  getFunctionByMenu(menuId) {
    return this.get(`/${menuId}`);
  }

  addFunctionToMenu(menuId, functionIds) {
    return this.post(`/${menuId}`, functionIds);
  }

}
