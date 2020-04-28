import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class ArrivalLeadtimeService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/delivery', true);
  }

  getArrivalLeadtime() {
    return this.get('');
  }

  createArrivalLeadtime(leadtime) {
    return this.post('', leadtime);
  }

  updateArrivalLeadtime(leadtime) {
    return this.put(`/${leadtime.id}`, leadtime);
  }

  search(fromDealerId, toDealerId) {
    let condition = '?';
    if (fromDealerId) {
      condition += `from_dealer=${fromDealerId}`;
    }
    if (toDealerId) {
      if (fromDealerId) {
        condition += '&';
      }
      condition += `to_dealer_id=${toDealerId}`;
    }
    return this.get(`/search${condition}`);
  }

  deleteArivalLeadTime(arrivalLeadTimeId) {
    return this.delete(`/${arrivalLeadTimeId}`);
  }
}
