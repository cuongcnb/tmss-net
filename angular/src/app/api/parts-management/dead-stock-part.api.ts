import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { FileUploader } from 'ng2-file-upload';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class DeadStockPartApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/part-function/deadstock');
  }

  searchDeadStockPart(dlrId?, partsCode?, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    let url = '/search?&';
    if (dlrId) {
      url += `dlrId=${dlrId}`;
    }
    if (partsCode) {
      url += `partsCode=${encodeURI(partsCode)}`;
    }
    return this.post(url, paginationParams);
  }

  sellDeadStockPart(arrayData) {
    return this.post(`sell`, arrayData);
  }

  exportDeadStockPart(dlrId?, partsCode?) {
    let url = '/export?&';
    if (dlrId) {
      url += 'dlrId=${dlrId}';
    }
    if (partsCode) {
      url += 'partsCode=${partsCode}';
    }
    return this.post(url, {});
  }

  importDeadStockPart(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + '/import',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }
}

