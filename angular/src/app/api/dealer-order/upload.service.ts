import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class UploadService extends BaseApiSaleService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/upload', true);
  }

  downloadFileDealer(searchData) {
    return this.download('/dlr_order/getFile', searchData);
  }

  downloadFileRundown(searchData) {
    return this.download('/dlr_rundown/getFile', searchData);
  }

  downloadFileDealerColorOrder(searchData) {
    return this.download('/dlr_order_color/getFile', searchData);
  }

  downloadFileDealerAllocation(searchData) {
    return this.download('/allocation/getFile', searchData);
  }
}
