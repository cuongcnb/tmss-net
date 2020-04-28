import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class YardAreaService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/areas', true);
  }

  getAllYardAreaAvailable() {
    return this.get(`/getAll?status=Y`);
  }

  getAllYardArea() {
    return this.get(`/getAll`);
  }

  getYardArea(yardId, isGetAvailable?) {
    const condition = isGetAvailable ? `?status=Y` : '';

    return this.get(`/${yardId}${condition}`);
  }

  createNewYardArea(data) {
    return this.post('', data);
  }

  updateYardArea(data) {
    return this.put(`/${data.id}`, data);
  }

  deleteYardArea(yardAreaId) {
    return this.delete(`/${yardAreaId}`);
  }

  getYardRegionVP() {
    return this.post(`/yard_areas`, ['YVP']); // get all yard region of Vinh Phuc
  }

  getYardRegionBD() {
    return this.post(`/yard_areas`, ['YBD']);  // get all yard region of Binh Duong
  }

  getYardNo() {
    return this.post(`/yard_areas`, ['YVP', 'HLVY']);  // Yard Region of YVP & HLVY
  }

}
