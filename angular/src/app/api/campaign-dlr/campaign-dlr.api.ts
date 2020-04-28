import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { EnvConfigService } from '../../env-config.service';

@Injectable()
export class CampaignDlrApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/campaign-dlr');
  }

  getCarModel(searchParams, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };
    const searchBody = Object.assign({}, searchParams, paginationParams);
    return this.post('/car-model', searchBody);
  }

  getCampaignDetail(id) {
    const url = id ? `/campaign-detail?id=${id}` : '/campaign-detail';
    return this.post(url);
  }

  search(obj) {
    return this.post('/search', obj);
  }

  updateAndAddCampaign(obj) {
    return this.post('/update-add', obj);
  }
  getListModelCar() {
    return this.get('/search-doixe');
  }
  // kiểm tra xe có tồn tại trong chiến dịch nào không
  checkCarInDealerCampaign(cmId: number) {
    return this.get(`/car-model/${cmId}`);
  }
}
