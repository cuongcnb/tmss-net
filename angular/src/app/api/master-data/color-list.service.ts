import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable({
  providedIn: 'root'
})
export class ColorListService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/colors', true);
  }

  getColors() {
    return this.get('');
  }

  getColorsAvailable() {
    return this.get(`?status=Y`);
  }

  createNewColor(color) {
    return this.post('', color);
  }

  updateColor(color) {
    return this.put(`/${color.id}`, color);
  }

  deleteColor(color) {
    return this.delete(`/${color}`);
  }
}
