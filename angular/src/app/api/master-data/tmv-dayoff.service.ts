import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable({
  providedIn: 'root'
})
export class TmvDayoffService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/day_off', true);
  }

  getDaysOff(month: number, year: number, calendarCode: string) {
    return this.get(`?month=${month}&year=${year}&calendar_code=${calendarCode}`);
  }

  submitDaysOff(dayOff) {
    return this.post('', dayOff);
  }
}
