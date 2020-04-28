import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class YardLocationService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/location', true);
  }

  getAllYardLocationAvailable() {
    return this.get(`?status=Y`);
  }

  getAllYardLocation() {
    return this.get(``);
  }

  getYardLocationTable(yardId) {
    return this.get(`/${yardId}`);
  }

  createNewYardLocation(YardLocation) {
    return this.post('', YardLocation);
  }

  updateYardLocation(YardLocation) {
    return this.put(`/${YardLocation.id}`, YardLocation);
  }

  deleteLocation(locationId) {
    return this.delete(`/${locationId}`);
  }

  getYardLocationParkingNotNo() {
    return this.get(`/parking_lot_no`); // get yard region of HLVY, YVP, XXX
  }

  getYardLocationOfYVP() {
    return this.post(`/yard_location`, ['YVP']); // get all yard region of Vinh Phuc
  }

  getYardLocationOfYBD() {
    return this.post(`/yard_location`, ['YBD']); // get all yard region of Binh Duong
  }
}
