import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { Observable } from 'rxjs';
import {EnvConfigService} from '../../env-config.service';

const partSearch = [{
  partscode: 'String',
  partsname: 'String',
  g_type_code: 'String',
  fobprice: 1231221,
  fobcurrencycode: 1231221,
  localflag: 'String',
  price: 1231221
}];


@Injectable()
export class DlrWarrantySearchApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('');
  }

  searchPart(obj) {
    const partCode = obj.partCode;
    // return this.get(`/warranty-parts/search?gTypeCode=P&localFlag=0${partCode ? '&partCode=' + partCode : ''}`)
    return new Observable((observer) => {
      setTimeout(() => observer.next(partSearch), 100);
    });
  }

}
