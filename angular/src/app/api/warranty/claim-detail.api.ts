import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';


@Injectable()
export class ClaimDetailApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/warranty');
  }

  saveClaim(dataSave) {
    return this.post('/save-claim', dataSave);

  }

  submitClaim(dataSave) {
    return this.post('/submit-claim', dataSave);

  }

  acceptClaim(dataSave) {
    return this.post('/tmv-accept-voucher-of-dealer', dataSave);
  }

  denyClaim(dataSave) {
    return this.post('/tmv-deny-voucher-of-dealer', dataSave);
  }

  returnClaim(dataSave) {
    return this.post('/tmv-return-voucher-of-dealer', dataSave);
  }

  adjustClaim(dataSave) {
    return this.post('/tmv-adjust-voucher-of-dealer', dataSave);
  }

  addjustmentClaim(curentClaimId, offset, dealerCode) {
    return this.get(`/addjustment-claim/${curentClaimId}/${offset}/${dealerCode}`);
  }

  dlrEditClaim(dealerClaimNo, dealerCode) {
    return this.get(`/edit-claim/${dealerClaimNo}/${dealerCode}`);
  }

  tmvEditCalim(twcNo, state?) {
    return this.get(`/edit-claim/${twcNo}?${ state ? 'state=' + state : ''}`);
  }

  createClaim(order?) {
    return this.get(`/create-new-claim${order ? '?dealerCode=' + order.dealercode + '&orderNo=' + order.orderno : ''}`);
  }

  getRepairOrderHistory(searchObj) {
    let searchQuery = '/repair-order/history?';
    for (const key in searchObj) {
      if (searchObj[key]) { searchQuery += `&${key}=${searchObj[key]}`; }
    }
    searchQuery = searchQuery === 'repair-order/history?' ? searchQuery.replace('?', '') : searchQuery.replace('&', '');
    return this.get(searchQuery);
  }
}



