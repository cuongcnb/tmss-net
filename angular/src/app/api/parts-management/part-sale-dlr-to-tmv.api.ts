import {BaseApiService} from '../base-api.service';
import {Injectable, Injector} from '@angular/core';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartSaleDlrToTmvApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-sale');
  }

  searchPart(partsCode) {
    return this.get(`/search-part-sale?partsCode=${partsCode ? partsCode : 'all'}`);
  }

  approve(obj) {
    return this.post(`/approve`, obj);
  }

  reject(obj) {
    return this.post(`/reject`, obj);
  }
  searchAllPartInStock(obj, pagination?) {
    pagination = pagination || {
      page: 1,
      size: 20
    };
    return this.post(`/part-instock-for-sale`, Object.assign({}, obj, pagination));
  }

  addPart(obj) {
    return this.post('/add', obj);
  }

  savePart(obj) {
    return this.put('/edit', obj);
  }

  deletePart(id) {
    return this.delete(`/delete/${id}`);
  }

}
