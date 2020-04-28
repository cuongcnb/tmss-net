import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../base-api.service';
import {FileUploader} from 'ng2-file-upload';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsInfoManagementApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-info');
  }

  searchPartsInfo(searchParams, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.post('/search', searchBody);
  }

  searchSellUnit(id) {
    return this.get(`/unit-select?id=${id}`);
  }

  searchPartForQuotation(searchParams, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.post('/order/search/quotation', searchBody);
  }

  getPartInfo4Quotation(partsId: Array<number>, quotationId?) {
    return this.post(`/order/quotation/part-info?reqId=${quotationId ? quotationId : ''}`, {chainOfid: partsId.toString()});
  }

  getPartListOfQuotation(repairOrderId) {
    return this.post(`/order/quotation/part-list?reqId=${repairOrderId}`);
  }

  searchPartForOrder(searchParams, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.post('/order/search', searchBody);
  }

  searchPartForSpecialOrder(searchParams, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.post('/special-order/search', searchBody);
  }

  // Call this api when search for part in parts-retail-new-order.component.ts
  searchPartWithStockInfo(searchParams, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.post('/order/search/stock-info', searchBody);
  }

  getPartsHistory(partId) {
    return this.post(`/price-history?partsId=${partId}`);
  }

  importPartsInfo(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + '/import'
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  partInfoOfAppoinment(appointmentId) {
    return this.post(`/order/appointment/part-info?appointmentId=${appointmentId}`);
  }

  partInfoOfRepairOrder(roId) {
    return this.post(`/order/repair-order/part-info?roId=${roId}`);
  }

  onHandWhenNotBooking(arr) {
    return this.post('/order/add/parts', arr);
  }

  getCampaignByCar(obj) {
    return this.post('/order/infor/campaign', obj);
  }


  getDataCode(dataCode) {
    return this.get(`/order/data/code?dataCode=${dataCode}`);
  }

  getListPart(partsCode) {
    return this.get(`/getList/${partsCode}`);
  }
}
