import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';
import {FileUploader} from "ng2-file-upload";

@Injectable()
export class CbuVehicleInfoService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/vehicle', true);
  }

  quickSearch(objSearch) {
    return this.post('/search', objSearch);
  }

  // search, filter start, search
  search(formName, globalFilter, searchFilter?, conditionFilters?, paginationParams?) {
    paginationParams = paginationParams || {
      sortType: null,
      page: 1,
      filters: [],
      size: 20,
      fieldSort: null
    };

    let dataRequest = {
      conditionFilters: conditionFilters ? conditionFilters : [],
      formName,
      globalFilter,
      searchFilter: searchFilter ? searchFilter : undefined,
    };

    if (paginationParams.page === 0) {
      paginationParams.page = 1;
    }

    if (paginationParams) {
      dataRequest = Object.assign({}, dataRequest, paginationParams);
    }
    return this.post('/condition-filter', dataRequest);
  }

  saveChanges(formName, obj) {
    return this.post(`?formName=${formName}`, obj);
  }

  getLogisticCo() {
    return this.get('/get-logistic-co');
  }

  importColorRequest(uploader: FileUploader){
    uploader.setOptions({
      url: this.baseUrl + '/import/load',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  saveFile() {
    return this.get('/import/save');
  }
}
