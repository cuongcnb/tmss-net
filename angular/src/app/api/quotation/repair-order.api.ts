import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class RepairOrderApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/repair-order');
  }

  searchByCusvs(dataSearch) {
    return this.post(`/search-by-cusvs`, dataSearch);
  }

  searchRo(dataSearch?, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const dataRequest = Object.assign({}, dataSearch, paginationParams);
    return this.post(`/search-ro-appoinment`, dataRequest);
  }

  // in Báo Giá
  printQuotation(data) {
    return this.download('/print-quotation', data);
  }

  printRepairChecklist(data) {
    return this.download('/print-repair-checklist', data);
  }

  // in LXPT
  printPartHandover(data) {
    return this.download('/print-part-handover', data);
  }

  // in LSC
  printRepairOrder(data) {
    return this.download('/print-repair-order', data);
  }

  // in Quyet toan
  printRoSettlement(data) {
    return this.download('/print-roprofile-settlement', data);
  }

  createQuotationTmp(data) {
    return this.post('/create-quotation-tmp', data);
  }

  createQuotation(data) {
    return this.post('/create-quotation', data);
  }

  createQuotationVersion(content, roIdDel?) {
    return this.post(`/create-quotation-version?description=${content}&roIdDel=${roIdDel}`);
  }

  searchQA(data, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, data, paginationParams);
    return this.post('/report-quotation/search', searchBody);
  }

  searchRepairHistory(data) {
    return this.post('/repair-order-history', data);
  }

  searchOldRepairHistory(data) {
    return this.post('/old-repair-order-history', data);
  }

  searchAllRepairHistory(data) {
    return this.post('/all-repair-order-history', data);
  }

  getRepairOrderDetails(id) {
    return this.get(`/ro-history-details?roId=${id}`);
  }

  getOldRepairOrderDetails(id) {
    return this.get(`/old-ro-history-details?roId=${id}`);
  }

  // in LSSC
  printRepairHistory(data) {
    return this.download('/print-ro-history', data);
  }

  // in LSSC cũ
  printOldRepairHistory(data) {
    return this.download('/print-old-ro-history', data);
  }

  searchByRepairOrderNo(id) {
    return this.get(`/search-by-repairorder-no?repairOrderNo=${id}`);
  }

  finishRo(id, vehicleId, customerId) {
    return this.get(`/complete-ro?roId=${id}&vehicleId=${vehicleId}&customerId=${customerId}`);
  }

  finishRoNotProgress(id) {
    return this.post(`//close-ro-hotfix?roId=${id}`);
  }

  cancelRo(id) {
    return this.get(`/cancel-ro?roId=${id}`);
  }

  getNextRepairOrder(roId, customerId, vehicleId) {
    return this.get(`/get-next-repairorder?currentRoId=${roId}&customerId=${customerId}&vehicleId=${vehicleId}`);
  }

  getPreviousRepairOrder(roId, customerId, vehicleId) {
    return this.get(`/get-previous-repairorder?currentRoId=${roId}&customerId=${customerId}&vehicleId=${vehicleId}`);
  }

  getNext(roId, cusVsId) {
    const url = () => {
      if (roId && cusVsId) {
        return 'cusVsId=' + cusVsId + '&roId=' + roId;
      }
      if (roId) {
        return 'currentRoId=' + roId;
      }
      if (cusVsId) {
        return 'cusVsId=' + cusVsId;
      }
      return '';


    };
    return this.get(`/get-next-repairorder?${url()}`);
  }

  getPrevious(roId, cusVsId) {
    const url = () => {
      if (roId && cusVsId) {
        return 'cusVsId=' + cusVsId + '&roId=' + roId;
      }
      if (roId) {
        return 'currentRoId=' + roId;
      }
      if (cusVsId) {
        return 'cusVsId=' + cusVsId;
      }
      return '';


    };
    return this.get(`/get-previous-repairorder?${url()}`);
  }


  techUpdate(roId, obj) {
    return this.put(`/tech-update/${roId}`, obj);
  }

  findMaxKm(id) {
    return this.get(`/find-max-kilometre?vehicleId=${id}`);
  }

  customerVisitInfo(ro) {
    return this.post(`/customer-visit-info?repairOrderNo=${ro}`);
  }

  printOutGate(roId) {
    return this.downloadByGet(`/print-outgate/${roId}`);
  }

  getListRo(vhcId) {
    return this.get(`/get-ro-info?vhcId=${vhcId}`);
  }

  addWorkSoon(obj) {
    return this.post('/work-soon', obj);
  }

  getWorkSoon(roId) {
    return this.get(`/work-soon/${roId}`);
  }

  suggestTime(obj) {
    return this.post(`/suggest-time`, obj);
  }

  getRecentlyPartPrice(roId, partId) {
    return this.get(`/part-price/${roId}/${partId}`);
  }

  getMrsTmssRo(roId) {
    return this.get(`/mrs-tmss-ro/${roId}`);
  }

  getInfo(id, reqType) {
    return this.get(`/search-profile-info/${id}/${reqType}`);
  }

  getRoSettlementInDay(obj) {
    return this.post(`/get-ro-settlement-in-day`, obj);
  }

  moveRoSettlementInDay(obj) {
    return this.post(`/move-ro-settlement-in-day`, obj);
  }

  getUpdateKm(searchData?, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, searchData, paginationParams);
    return this.post(`/search-update-km`, searchBody);
  }

  saveUpdateKm(data) {
    return this.post('/update-km', data);
  }

  findOne(roId) {
    const url = () => {
      if (roId) {
        return 'roId=' +  roId;
      }
      return '';
    };
    return this.get(`/ro-list?${url()}`);
  }

}
