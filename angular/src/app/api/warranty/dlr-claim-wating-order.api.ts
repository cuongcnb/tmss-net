import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { Observable } from 'rxjs';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class DlrClaimWatingOrderApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('');
  }

  search(searchData, paginationParams?) {
    // paginationParams = paginationParams || {
    //   page: 1,
    //   size: 20,
    // }
    // const dataRequest = Object.assign({}, searchData, paginationParams)
    // return this.post('/generate-claim-via-order/search', dataRequest)
    return new Observable((observer) => {
      setTimeout(() => observer.next(''), 100);
    });
  }
}
