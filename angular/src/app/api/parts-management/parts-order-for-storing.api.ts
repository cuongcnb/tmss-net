import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class PartsOrderForStoringApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part/stock-reserve');
  }

  getParts(paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    return this.post('/search', paginationParams);
  }

  orderParts(partList) {
    return this.post('/order', partList);
  }

  replacePart(oldPartId, newPartId) {
    return this.post(`/replace-part?oldPartsId=${oldPartId}&newPartsId=${newPartId}`);
  }

  cancelPart(partId) {
    return this.post(`/cancel-part?partsId=${partId}`);
  }
}
