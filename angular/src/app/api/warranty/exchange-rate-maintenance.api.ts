import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';
import {Observable} from 'rxjs';

@Injectable()
export class ExchangeRateMaintenanceApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/warranty-master');
  }

  getExchangeRate() {
    return this.get(`/search-exchange-rate`);
  }

  removeExchange(exchangeId) {
    return this.delete(`/delete-exchange-rate/${exchangeId}`, );
  }

  saveExchangeRate(data): Observable<any> {
    return this.post('/save-exchange-rate', data);
  }
}
