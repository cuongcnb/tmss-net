import { Injectable, Injector } from '@angular/core';

import { BaseApiService } from '../base-api.service';
import { PartsExportRoModel } from '../../core/models/parts-management/parts-export.model';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsExportApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-export/ro');
  }

  // Get RO, Ro Detail and Parts of RO
  searchRo(searchParams, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchObj = Object.assign(searchParams, paginationParams);
    return this.post('/search', searchObj);
  }

  getCustomerDetail(requestRo) {
    return this.post('/customer-search', requestRo);
  }

  getPartOfRo(requestRo) {
    return this.post('/part-search', requestRo);
  }

  // Get part detail for "Chi tiet xuat phu tung" grid
  getPartShippingHistory(selectedPart) {
    return this.post('/part-shipping-history', selectedPart);
  }

  getPrepickOfRo(requestRo) {
    return this.post(`/part-prepick-search?reqId=${requestRo.reqId}&reqType=${requestRo.reqtype}`);
  }

  // Export
  exportSinglePart(requestBody) {
    return this.post('/approve', requestBody);
  }

  exportAllPart(requestBody) {
    return this.post('/approve/all', requestBody);
  }

  // View receipt
  viewAllExport(reqId, reqType) {
    return this.post(`/view-all?reqId=${reqId}&reqType=${reqType}`);
  }

  viewSingleExport(reqId, reqType, shippingNumber) {
    return this.post(`/view-no?reqId=${reqId}&reqType=${reqType}&shippingNumber=${shippingNumber}`);
  }

  getNumberOfShipping(reqId, reqType) {
    return this.get(`/view-no/no-of-shipping?reqId=${reqId}&reqType=${reqType}`);
  }

  // =====**** PREPICK ****=====
  returnPrepickPart(partsIdArr) {
    return this.post('/return', partsIdArr);
  }

  exportPrePickPart(prepickDto, selectedRo: PartsExportRoModel) {
    return this.post(`/approve-prepick?reqType=${selectedRo.reqtype}&roStatus=${selectedRo.status}`, prepickDto);
  }

  returnAllPrePickPart(partsIdArr) {
    return this.post('/return/all', partsIdArr);
  }

  exportAllPrePickPart(prepickDtoArr, selectedRo: PartsExportRoModel) {
    return this.post(`/approve-prepick/all?reqType=${selectedRo.reqtype}&roStatus=${selectedRo.status}`, prepickDtoArr);
  }

  // PRINT
  printExportSlip(exportData) {
    return this.download('/export', exportData);
  }
}
