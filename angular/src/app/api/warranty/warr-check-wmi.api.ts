import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';
import {FileUploader} from 'ng2-file-upload';

@Injectable()
export class WarrCheckWmiApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/warranty-master');
  }

  // search(searchData, paginationParams?) {
  //   paginationParams = paginationParams || {
  //     page: 1,
  //     size: 20,
  //   };
  //   const dataRequest = Object.assign({}, searchData, paginationParams);
  //   return this.post(`/search-warranty-vehicle`, dataRequest);
  // }


  saveWarrCheckWmi(data) {
    return this.post('/save-warr-check-wmi', data);
  }

  getWarrCheckWmi(data, paginationParams?) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20
    };

    const searchBody = Object.assign({}, data, paginationParams);
    return this.post('/get-warr-check-wmi', searchBody);
  }

  removeWarrCheckWmi(id) {
    return this.delete(`/warr-check-wmi/${id}`);
  }

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
