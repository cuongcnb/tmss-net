import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { EnvConfigService } from '../../env-config.service';

@Injectable()
export class CustomerApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/customer');
  }

  searchCarModelByCfId(cfId?) {
    let searchQuery = '/car_model?';
    if (cfId) {
      searchQuery += (`&cf_id=${cfId}`);
    }
    return this.get(searchQuery);
  }

  getCustomerData(searchData, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    searchData = Object.assign({}, searchData, paginationParams);
    return this.post('/search_customer', searchData);
  }

  searchForEditing(searchData) {
    return this.post('/search-for-editing', searchData);
  }

  insertNew(data) {
    return this.post('/insert', data);
  }

  // include vehicles & customer_d
  updateData(data) {
    return this.put('/update', data);
  }

  // only customer
  updateCustomerInfo(data) {
    return this.put('/update_info', data);
  }

  getCustomerRoData(customerId, vinNo) {
    return this.post(`/get-customer-ro?customerId=${customerId}&vinNo=${vinNo}`);
  }

  getCustomerDetail(data) {
    return this.post('/customer-details', data);
  }

  getLastCustomerCusvisitData(data) {
    return this.post('/get-last-cusvisit', data);
  }

  checkDuplicateVinno(data) {
    return this.post('/check-duplicate', data);
  }

  // Chiến dịch đại lý
  getCampaignByVin(vinno: string, registerNo?) {
    if (!!registerNo) {
      return this.get(`/get-campaign-by-vin/${vinno}?registerNo=${registerNo}`);
    } else { return this.get(`/get-campaign-by-vin/${vinno}`); }
  }

  remindCampaign(campaignRemind) {
    return this.post('/remind-campaign', campaignRemind);
    //   {
    //   "campId": 0,
    //   "engineNo": "string",
    //   "vehId": 0,
    //   "vinno": "string"
    // }
  }

  requestCampaign(campaignRequest) {
    return this.post('/request-campaign', campaignRequest);
    //   {
    //   "campId": 0,
    //   "engineNo": "string",
    //   "vehId": 0,
    //   "vinno": "string"
    // }
  }
}
