import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { sendFormData } from './form-sender';
import { DataFormatService } from '../shared/common-service/data-format.service';
import { StorageKeys } from '../core/constains/storageKeys';
import { EnvConfigService } from '../env-config.service';

@Injectable()
export class BaseApiService {
  baseUrl: string;
  protected http: HttpClient = this.injector.get(HttpClient);
  protected dataFormatService: DataFormatService = this.injector.get(DataFormatService);
  numberFields = ['ordering'];

  constructor(protected injector: Injector, private envConfigService: EnvConfigService) {}

  setBaseUrl(url: string, isIgnoreBase?: boolean) {
    // const baseUrl = !isIgnoreBase ? `${environment.api_url}${url}` : `${environment.api_url.replace('service', '')}${url}`;
    this.baseUrl = !isIgnoreBase
      ? `${this.envConfigService.getConfig().backEnd}${url}`
      : `${this.envConfigService.getConfig().backEnd.replace('service', '')}${url}`;
  }
  postWithoutFormatData(url: string, body: object = {}): Observable<any> {
    return this.http.post(this.buildUrl(url), JSON.stringify(body));
  }
  getAll(isAll = true) {
    return this.get(!isAll ? `/active` : ``);
  }

  getOne(id) {
    return this.get(`/findOne/${id}`);
  }

  create(newObj) {
    return this.post(``, newObj);
  }

  update(updateObj) {
    return this.put(`/${updateObj.id}`, updateObj);
  }

  setInActive(id) {
    return this.delete(`/inactive/${id}`);
  }

  remove(id) {
    return this.delete(`/${id}`);
  }

  get(url: string, params: HttpParams = new HttpParams()): Observable<any> {
    params = this.formatDataBeforeSend(params, this.numberFields);
    return this.http.get(this.buildUrl(url), {params});
  }

  put(url: string, body: object = {}): Observable<any> {
    body = this.formatDataBeforeSend(body, this.numberFields);
    return this.http.put(this.buildUrl(url), JSON.stringify(body));
  }

  post(url: string, body: object = {}): Observable<any> {
    body = this.formatDataBeforeSend(body, this.numberFields);
    return this.http.post(this.buildUrl(url), JSON.stringify(body));
  }

  upload(url: string, formData: FormData): Observable<any> {
    return this.http.post(this.buildUrl(url), formData, { reportProgress: true });
  }

  download(url: string, body: object = {}): Observable<any> {
    body = this.formatDataBeforeSend(body, this.numberFields);
    return this.http.post(this.buildUrl(url), JSON.stringify(body), {responseType: 'blob', observe: 'response'});
  }

  downloadByGet(url: string): Observable<any> {
    return this.http.get(this.buildUrl(url), {responseType: 'blob', observe: 'response'});
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

  buildParams(...args) {
    let paramsStr = '';
    const length = args.length;
    if (length > 0) {
      paramsStr += `?${args[0]}`;
      for (let i = 1; i < length; i++) {
        paramsStr += `&${args[i]}`;
      }
    }
    return paramsStr;
  }

  private buildUrl(url?: string) {
    return this.baseUrl + url;
  }

  private formatDataBeforeSend(data, numberFields?) {
    // trim space and convert number field
    const current = data;
    if (current && typeof current === 'object') {
      if (numberFields) {
        numberFields.forEach(field => {
          if (current[field] && typeof current[field] === 'string') {
            current[field] = parseInt(current[field].replace(/,/g, ''), 10);
          }
        });
      }
      for (let i = 0; i < current.length; i++) {
        if (typeof current[i] === 'string') {
          current[i] = current[i].trim() !== '' ? current[i].trim() : null;
        }
      }
    }
    return current;
  }
}
