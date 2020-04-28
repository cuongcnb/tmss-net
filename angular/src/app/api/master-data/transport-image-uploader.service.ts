import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class TransportImageUploaderService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/image_upload', true);
  }

  uploadNewImage(file) {
    const formData = new FormData();
    formData.append('imageData', file);
    return this.sendForm('', formData).send().response;
  }

}
