import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class TransportTypeService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/transportation_type', true);
  }

  getTransportTypeAvailable() {
    return this.get(`?status=Y`);
  }

  getAllTransportType() {
    return this.get('');
  }

  getTransportType(meanId) {
    return this.get(`/${meanId}`);
  }

  createNewTransportType(transType) {
    return this.post('', transType);
  }

  updateTransportType(transType) {
    return this.put(`/${transType.id}`, transType);
  }

  deleteTransportType(transportTypeId) {
    return this.delete(`/${transportTypeId}`);
  }
}
