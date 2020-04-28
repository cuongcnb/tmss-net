import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class InteriorAssignmentService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/interior_color', true);
  }

  getColors(productId, isGetAvailable?) {
    const condition = isGetAvailable ? `?status=${true}` : '';
    return this.get(`/${productId}${condition}`);
  }

  getIntColorsForCbuCkd(gradeId, isGetAvailable?) {
    const condition = isGetAvailable ? `?status=${true}` : '';
    return this.get(`/grade/${gradeId}${condition}`);
  }

  createNewColor(color) {
    return this.post('', color);
  }

  updateColor(color) {
    return this.put(`/${color.id}`, color);
  }

  deleteColor(colorId) {
    return this.delete(`/${colorId}`);
  }

  getAllIntColorsForCbuCkd() {
    return this.get(`/grade/-999?status=Y`);
  }
}
