import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsRetailApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part/single');
  }

  searchRetailOrder(searchObj, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchParams = Object.assign(paginationParams, searchObj);
    return this.post(`/search/order`, searchParams);
  }

  // Get 3 fields: onHandQty, ddQty, dxQty for new parts
  getPartDetail(counterSaleId, partsId) {
    const requestUrl = counterSaleId
      ? `/search/part-info?partsId=${partsId}&counterSaleId=${counterSaleId}`
      : `/search/part-info?partsId=${partsId}`;
    return this.post(requestUrl);
  }

  getOrderDetail(orderId) {
    return this.post(`/search?counterSaleId=${orderId}`);
  }

  deleteOrder(orderId) {
    return this.delete(`/order?counterSaleId=${orderId}`);
  }

  deletePartOfOrder(orderId, partId) {
    return this.delete(`/part?counterSaleId=${orderId}&partsId=${partId}`);
  }

  updateOrder(orderDetail) {
    return this.put('', orderDetail);
  }

  printQuotation(orderId, extension) {
    return this.download(`/print/quotation?counterSaleId=${orderId}&extension=${extension}`);
  }

  printInvoice(obj) {
    return this.download(`/print/invoice`, obj);
  }

  printLxpt(obj) {
    return this.download(`/print/lxpt`, obj);
  }
}
