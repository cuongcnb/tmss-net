import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class GradeProductionService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/product', true);
  }

  getAllGradeProduction() {
    return this.get('');
  }

  getGradeProductionTable(gradeId, isGetAvailable?) {
    const condition = isGetAvailable ? `?status=${true}` : '';
    return this.get(`/${gradeId}${condition}`);
  }

  createNewGradeProduction(gradeProduction) {
    return this.post('', gradeProduction);
  }

  updateGradeProduction(gradeProduction) {
    return this.put(`/${gradeProduction.id}`, gradeProduction);
  }

  deleteGradeProduction(gradeProductionId) {
    return this.delete(`/${gradeProductionId}`);
  }

  getGradeProductByGradeAndVehicleType(gradeId, cbuCkd, isGetAvailable?) {
    const condition = isGetAvailable ? `?status=${true}` : `?status=${false}`;
    return this.get(`/${gradeId}/${cbuCkd}${condition}`);
  }

  getGradeProductByGrade(gradeId, isGetAvailable?) {
    const condition = isGetAvailable ? `/status=${true}` : '';
    return this.get(`/${gradeId}${condition}`);
  }


}
