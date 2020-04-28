import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PaymentFollowupService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/tfs', true);
  }

  searchPaymentFollowup(searchObj, filterDataList, paginationParams?) {
    paginationParams = paginationParams || {
      sortType: null,
      page: 1,
      filters: [],
      size: 20,
      fieldSort: null
    };
    const searchBody = Object.assign(paginationParams, {filterData: filterDataList}, searchObj);
    return this.post('/payment_followup', searchBody);
  }

  filterCommon(filterDataList) {
    return this.post('/filter', filterDataList);
  }

  approvePaymentFollowup(dealerIdArr, vehicleId?) {
    // Approve one Vehicle or multiple Vehicles by dealer
    return vehicleId ? this.post(`/approve_payment?vehicle_id=${vehicleId}`, dealerIdArr) : this.post('/approve_payment', dealerIdArr);
  }

  undoPaymentFollowup(paymentFollowup) {
    return this.post('/undo_payment', paymentFollowup);
  }
}
