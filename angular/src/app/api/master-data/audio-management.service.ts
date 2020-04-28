import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class AudioManagementService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/audio', true);
  }

  getAudioTable() {
    return this.get('');
  }

  getAvailableAudios() {
    return this.get('/available');
  }

  createNewAudio(audio) {
    return this.post('', audio);
  }

  updateAudio(audio) {
    return this.put(`/${audio.id}`, audio);
  }

  deleteAudio(audioId) {
    return this.delete(`/${audioId}`);
  }
}
