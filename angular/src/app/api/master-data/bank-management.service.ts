import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class BankManagementService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/banks', true);
  }

  getBankTable() {
    return this.get('');
  }

  getAvailableBanks() {
    return this.get('/available');
  }

  createNewBank(bank) {
    return this.post('', bank);
  }

  updateBank(bank) {
    return this.put(`/${bank.id}`, bank);
  }

  deleteBank(bankId) {
    return this.delete(`/${bankId}`);
  }
}
