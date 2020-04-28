import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class ContractManagementService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/contract', true);
  }

  searchContract(searchData, params?, paginationParams?) {
    paginationParams = paginationParams || {
      sortType: null,
      page: 1,
      filters: [],
      size: 20,
      fieldSort: null
    };
    if (paginationParams.page === 0) {
      paginationParams.page = 1;
    }
    if (paginationParams) {
      searchData = Object.assign({}, searchData, paginationParams, params);
    }

    return this.post('/search_contract', searchData);
  }

  createNewContract(contractForm) {
    return this.post('', contractForm);
  }

  updateContract(contractFollowup) {
    return this.put(`/${contractFollowup.id}`, contractFollowup);
  }

  getCurrentContractNo(dealerId) {
    return this.get(`/currentContractNo/${dealerId}`);
  }

  getContractFleet(dealerId) {
    return this.get(`/contractFleet/${dealerId}`);
  }

  getModifyData(contractFollowupId) {
    return this.get(`/modifyData/${contractFollowupId}`);
  }

  insertMultiplyContract(data) {
    return this.post('/multiply', data);
  }

  getSalesData(contractFollowupId) {
    return this.get(`/sale/${contractFollowupId}`);
  }

  getCancelData(contractFollowupId) {
    return this.get(`/cancel/${contractFollowupId}`);
  }

  cancelContract(contractFollowupId, data) {
    return this.put(`/cancel/${contractFollowupId}`, data);
  }

  approveCancelContract(contractFollowupId) {
    return this.put(`/cancel/${contractFollowupId}/approve`);
  }

  rejectCancelContract(contractFollowupId) {
    return this.put(`/cancel/${contractFollowupId}/reject`);
  }

  unCancelContract(contractFollowupId, isAll) {
    return this.put(`/unCancel/${contractFollowupId}/isAll/${isAll}`);
  }

  approveUncancelContract(contractFollowupId) {
    return this.put(`/unCancel/${contractFollowupId}/approve`);
  }

  rejectUncancelContract(contractFollowupId) {
    return this.put(`/unCancel/${contractFollowupId}/reject`);
  }

  getChangeData(contractFollowupId) {
    return this.get(`/change/${contractFollowupId}`);
  }

  changeContractData(contractFollowupId, data) {
    return this.put(`/change/${contractFollowupId}`, data);
  }

  checkColorProduct(contractFollowupId, productId) {
    return this.get(`/check_color_product?follow_up_id=${contractFollowupId}&product_id=${productId}`);
  }

  approveChangeContract(contractFollowupId, data) {
    return this.put(`/change/${contractFollowupId}/approve`, data);
  }

  approveChangeGrade(contractFollowupId, data) {
    return this.put(`/change_production/${contractFollowupId}/approve`, data);
  }

  rejectChangeContract(contractFollowupId) {
    return this.put(`/change/${contractFollowupId}/reject`);
  }

  approveOneChangeContract(contractFollowupId, fieldName, fieldData) {
    return this.put(`/change/${contractFollowupId}/approve/${fieldName}`, fieldData);
  }

  saleContract(data) {
    return this.put(`/contract_sale/${data.id}`, data);
  }

  regainFrameNo(contractFollowupId) {
    return this.put(`/change/${contractFollowupId}/regain`);
  }

  getChangeDelivery(contractFollowupId) {
    return this.get(`/changeDelivery/${contractFollowupId}`);
  }

  updateChangeDelivery(contractFollowupId, data) {
    return this.put(`/changeDelivery/${contractFollowupId}`, data);
  }

  searchChangeDelivery(searchObj, filterStartForm) {
    const searchBody = Object.assign({}, filterStartForm, searchObj);
    return this.post('/contract_delivery', searchBody);
  }

  findAllChangeDeliveryLogs(contractFollowupId) {
    return this.get(`/delivery_change_log/${contractFollowupId}`);
  }

  updateContractFollowup(data) {
    return this.put('/modify_contract_followup', data);
  }

}

