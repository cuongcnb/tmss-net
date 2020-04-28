import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsCheckPriceCodeApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-inquiry');
  }

  searchInquiry(searchObj, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, searchObj, paginationParams);
    return this.post('/search-header', searchBody);
  }

  getPartsOfInquiry(inquiryId) {
    return this.get(`/detail/${inquiryId}`);
  }

  editInquiry(modifyData) {
    return this.post('/edit-query', modifyData);
  }

  exportExcel(idArr) {
    return this.download('/export/inquiry-parts', idArr);
  }

  saveDraft(data) {
    return this.post('/save-query?flagMode=0', data);
  }

  send(data) {
    return this.post('/submit-query-to-tmv?flagMode=1', data);
  }
}
