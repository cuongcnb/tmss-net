import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable({
  providedIn: 'root'
})
export class ColorAssignmentService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/colors_produce', true);
  }

  getColors(productId, isGetAvailable?) {
    const condition = isGetAvailable ? `?status=${true}` : '';
    return this.get(`/${productId}${condition}`);
  }

  getColorsForCbuCkd(graProId, isGetAvailable?) {
    const condition = isGetAvailable ? `?status=${true}` : '';
    return this.get(`/grade/${graProId}${condition}`);
  }

  createNewColor(color) {
    return this.post('', color);
  }

  updateColor(color) {
    return this.put(`/${color.id}`, color);
  }

  deleteColorAssigment(colorId) {
    return this.delete(`/${colorId}`);
  }

  getAllColorsForCbuCkd() {
    return this.get(`/grade/-999?status=Y`);
  }
}
