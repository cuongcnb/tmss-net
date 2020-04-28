import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class InvoiceLeadTimeService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/invoice_time', true);
  }

  getInvoice() {
    return this.get('');
  }

  createNewInvoice(invoice) {
    return this.post('', invoice);
  }

  updateInvoice(invoice) {
    return this.put(`/${invoice.id}`, invoice);
  }

  deleteInvoiceLeadTime(invoiceLeadTimeId) {
    return this.delete(`/${invoiceLeadTimeId}`);
  }
}
