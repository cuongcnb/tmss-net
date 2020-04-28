import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { sendFormData } from './form-sender';
import { StorageKeys } from '../core/constains/storageKeys';
import { DataFormatService } from '../shared/common-service/data-format.service';
import { EnvConfigService } from '../env-config.service';

@Injectable()
export class BaseApiSaleService {
  baseUrl: string;
  protected http: HttpClient = this.injector.get(HttpClient);
  protected dataFormatService: DataFormatService = this.injector.get(DataFormatService);
  numberFields = ['ordering'];

  constructor(protected injector: Injector, private envConfigService: EnvConfigService) {
  }

  setBaseUrl(url: string, isIgnoreBase?: boolean) {
    // const baseUrl = !isIgnoreBase ? `${environment.api_url}${url}` : `${environment.api_url.replace('tmss', '')}`;
    this.baseUrl = !isIgnoreBase
      ? `${this.envConfigService.getConfig().backEnd}${url}`
      : `${this.envConfigService.getConfig().backEnd.replace('service', '')}${url}`;
  }

  get(url: string, params: HttpParams = new HttpParams()): Observable<any> {
    params = this.formatDataBeforeSend(params, this.numberFields);
    return this.http.get(this.buildUrl(url), { params });
  }

  put(url: string, body: object = {}): Observable<any> {
    body = this.formatDataBeforeSend(body, this.numberFields);
    return this.http.put(this.buildUrl(url), JSON.stringify(body));
  }

  post(url: string, body: object = {}): Observable<any> {
    body = this.formatDataBeforeSend(body, this.numberFields);
    return this.http.post(this.buildUrl(url), JSON.stringify(body));
  }

  postWithoutFormatData(url: string, body: object = {}): Observable<any> {
    return this.http.post(this.buildUrl(url), JSON.stringify(body));
  }

  upload(url: string, formData: FormData): Observable<any> {
    return this.http.post(this.buildUrl(url), formData, { reportProgress: true });
  }

  download(url: string, body: object = {}): Observable<any> {
    body = this.formatDataBeforeSend(body, this.numberFields);
    return this.http.post(this.buildUrl(url), JSON.stringify(body), { responseType: 'blob', observe: 'response' });
  }

  downloadByGet(url: string): Observable<any> {
    return this.http.get(this.buildUrl(url), { responseType: 'blob', observe: 'response' });
  }

  delete(url: string): Observable<any> {
    return this.http.delete(this.buildUrl(url));
  }

  sendForm(url, formData) {
    const endpoint = this.baseUrl + url;
    const token = JSON.parse(localStorage.getItem(StorageKeys.currentUser)).token;
    const headers = {
      authorization: `Bearer ${token}`,
      // 'Content-Type': 'multipart/form-data',
      Accept: 'application/json'
    };
    return sendFormData(endpoint, formData, headers);
  }

  private buildUrl(url?: string) {
    return this.baseUrl + url;
  }

  private formatDataBeforeSend(data, numberFields?) {
    // trim space and convert number field
    let current = data;
    if (current && typeof current === 'object') {
      Object.entries(current).forEach((entry) => {
        if (entry[0].toLowerCase().indexOf('modifydate') < 0
          && entry[0].toLowerCase().indexOf('date') > -1
          && (typeof entry[1] !== 'boolean') && entry[1] && !!new Date(entry[1].toString())) {
          current[entry[0]] = this.dataFormatService.formatDateSale(entry[1]);
        } else {
          current[entry[0]] = this.formatDataBeforeSend(entry[1]);
        }
      });
      if (numberFields) {
        numberFields.forEach(field => {
          if (current[field] && typeof current[field] === 'string') {
            current[field] = parseInt(current[field].replace(/,/g, ''), 10);
          }
        });
      }
    }
    if (typeof data === 'string') {
      current = current.trim();
    }
    return current;
  }
}
