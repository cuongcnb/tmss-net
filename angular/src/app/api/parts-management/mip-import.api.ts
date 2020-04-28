import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { FileUploader } from 'ng2-file-upload';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class MipImportApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/mip');
  }

  // import(fileData) {
  //   return this.post(`/import`, fileData);
  // }
  import(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + '/import/upload',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  save(data) {
    return this.post('/import', data);
  }
}
