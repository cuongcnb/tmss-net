import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class ModelListService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/models', true);
  }

  getModelTable() {
    return this.get('');
  }

  getAvailableModel() {
    return this.get('/available');
  }

  createNewModel(model) {
    return this.post('', model);
  }

  updateModel(model) {
    return this.put(`/${model.id}`, model);
  }

  deleteModel(modelId) {
    return this.delete(`/${modelId}`);
  }

  getCbuByAllocation(searchData) {
    return this.post('/get-cbu-by-allocation', searchData);
  }

}
