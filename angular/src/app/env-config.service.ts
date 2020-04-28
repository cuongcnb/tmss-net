import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {isNullOrUndefined} from 'util';

import {EnvConfig} from './env-config';
import {StorageKeys} from './core/constains/storageKeys';

@Injectable({
  providedIn: 'root'
})
export class EnvConfigService {
  private envConfig: EnvConfig;
  private envConfigNull: EnvConfig = null;

  constructor(private http: HttpClient) {
  }

  loadEnvConfig() {
    this.http.get('/assets/config-timeout-api.json')
      .subscribe(data => {
        localStorage.setItem(StorageKeys.configTimeoutApi, JSON.stringify(data));
      });
    if (isNullOrUndefined(this.envConfig)) {
      return this.http.get<EnvConfig>('/assets/env.json')
        .toPromise<EnvConfig>()
        .then(data => this.envConfig = data);
    }

    return Promise.resolve(this.envConfigNull);
  }

  getConfig(): EnvConfig {
    if (this.envConfig) {
      return this.envConfig;
    }
  }
}
