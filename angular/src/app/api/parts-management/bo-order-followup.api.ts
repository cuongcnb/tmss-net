import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class BoOrderFollowupApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-bo/bo-follow');
  }

  searchOrder(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign(searchObj, paginationParams);
    return this.post('/search', searchBody);
  }

  getPartOfBo(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign(searchObj, paginationParams);
    return this.post('/search/detail', searchBody);
  }

  // View Detail Modal
  searchBoList(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchObj, paginationParams);
    return this.post(`/view/detail/search`, searchBody);
  }

  searchPartOfBo(orderId, searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchObj, paginationParams);
    return this.post(`/view/detail/part/search?orderId=${orderId}`, searchBody);
  }

  // ====**** FOR NVPT ****====
  searchPartForNvpt(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchObj, paginationParams);
    return this.post('/nvpt/search', searchBody);
  }

  getEditDataNvpt(data) {
    return this.post('/nvpt/appointment-data', data);
  }

  editPartForNvpt(editedObj) {
    return this.post('/nvpt', editedObj);
  }

  exportDataNvpt(searchObj) {
    return this.download('/nvpt/report', searchObj);
  }

  // ====**** FOR CVDV ****====
  searchPartForCvdv(searchObj, isReload, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const pIsReload = {
      isReload
    };
    const searchBody = Object.assign({}, searchObj, pIsReload, paginationParams);
    return this.post('/advisor/search', searchBody);
  }

  searchCountForCvdv(searchObj) {
    const searchBody = Object.assign({}, searchObj);
    return this.post('/advisor/search/count', searchBody);
  }

  deleteBoFollow(reqId) {
    return this.delete(`/advisor?id=${reqId}`);
  }

  viewDetailForCvdv(dlrId, reqId, reqType) {
    return this.post(`/part-bo/bo-follow/advisor/view?dlrId=${dlrId}&reqId=${reqId}&reqType=${reqType}`);
  }

  getEditDataCvdv(reqId) {
    return this.post(`/advisor/view-edited?reqId=${reqId}`);
  }

  editBoForCvdv(editedObj) {
    return this.post('/advisor', editedObj);
  }

  exportDataCvdv() {
    return this.download('/advisor/report');
  }
}
