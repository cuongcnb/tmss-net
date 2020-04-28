import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { CusDetailModel, CustomerInfoModel } from '../../core/models/advisor/standarize-customer-info.model';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class StandardizeCustomerApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/customer-standardized');
  }

  search(registerNo) {
    const body = Object.assign({}, {
      registerno: registerNo
    });
    return this.post(`/search`, body);
  }

  getLscOfCustomers(listCusId: Array<number>) {
    return this.post(`/repair-order`, {chainOfid: listCusId.toString()});
  }

  getLscOfCusDetails(listCusId: Array<number>) {
    return this.post(`/repair-order-cusD`, {chainOfid: listCusId.toString()});
  }

  mergeCustomerInfor(cusInfo: CustomerInfoModel) {
    return this.post(`/customers-infor`, cusInfo);
  }

  mergeCustomerDetailInfor(cusId: number, cusDetailInfo: CusDetailModel) {
    return this.post(`/customers-infor/${cusId}`, cusDetailInfo);
  }

  getCounterSales(listCusId: Array<number>) {
    return this.post(`/counter-sales`, {chainOfid: listCusId.toString()});
  }

  getCounterSalesParts(ctSalesId) {
    return this.get(`/counter-sales-parts/${ctSalesId}`);
  }
}
