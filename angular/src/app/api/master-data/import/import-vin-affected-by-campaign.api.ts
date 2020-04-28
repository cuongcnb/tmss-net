import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../../base-api.service';
import { FileUploader } from 'ng2-file-upload';
import {EnvConfigService} from '../../../env-config.service';

@Injectable()
export class ImportVinAffectedByCampaignApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/campaign');
  }

  importVinAffected(uploader: FileUploader) {
    uploader.setOptions({
      url: this.baseUrl + '/upload',
    });
    uploader.queue[uploader.queue.length - 1].upload();
  }

  downloadTemplate(type) {
    // return this.get(`import/get_import_template/${type}`)
  }

}
