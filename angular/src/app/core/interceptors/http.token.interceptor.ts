import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {tap, timeout} from 'rxjs/operators';

import {FormStoringService} from '../../shared/common-service/form-storing.service';
import {StorageKeys} from '../constains/storageKeys';
import {ToastService} from '../../shared/swal-alert/toast.service';
import {ErrorCodes} from './error-code';
import {GoogleApi} from '../constains/google-api';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  defaultTimeout = 120000; // 1 phút
  msgTimeout = 'TimeoutError';
  listTimeout;

  constructor(
    private formStoringService: FormStoringService,
    private swalAlertService: ToastService,
    private router: Router
  ) {
    this.listTimeout = JSON.parse(localStorage.getItem(StorageKeys.configTimeoutApi)) || [];
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const dataTimeOut = this.listTimeout.find(it => req.url.indexOf(it.key) > -1);
    const timeoutValue = dataTimeOut ? dataTimeOut.value : this.defaultTimeout;
    // @ts-ignore
    let headersConfig: any = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
      // 'If-Modified-Since': '0'
    };
    const token = this.formStoringService.get(StorageKeys.currentUser).token;
    if (token) {
      headersConfig = Object.assign({}, headersConfig, {
        Authorization: `Bearer ${token}`
      });
    }

    if (req.url.includes(GoogleApi.texttospeech.url)) {
      headersConfig = Object.assign({}, {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      });
    }

    if (req.url.indexOf('/service/upload-file') > -1) {
      headersConfig = Object.assign({}, {Authorization: `Bearer ${token}`});
    }


    const request = req.clone({headers: new HttpHeaders(headersConfig)});
    // @ts-ignore
    return next.handle(request).pipe(timeout(timeoutValue), tap(() => {
    }, res => {
      const loadingElem = document.getElementById('loading-component');
      if (loadingElem) {
        loadingElem.parentNode.removeChild(loadingElem);
      }

      // if (res.url.includes(GoogleApi.texttospeech.url)) {
      //   this.swalAlertService.openWarningToast('Không thể gọi khách hàng qua loa.', 'Thông Báo');
      // }

      if (res && res.url && res.url.indexOf('/tmss') > -1 && res.url.indexOf('tmss-demo.ecomedic') < 0) {
        let mess = res.error ? res.error.message : '';
        if (res.status === 491 || res.status === 424) {
          mess = ErrorCodes[res.status];
        }
        if (res.status === 406 || res.status === 505) {
          mess = res.error;
        }
        if (res.status === 401) {
          this.swalAlertService.openFailToast('Bạn không có quyền thực hiện chức năng này. Mời đăng nhập lại');
          localStorage.clear();
          setTimeout(() => {
            document.body.classList.add('login');
            this.router.navigate(['/auth/login']);
          }, 100);
          return;
        }
        this.swalAlertService.openFailToast(mess);
        return;
      }

      switch (res.status) {
        case 401: {
          this.swalAlertService.openFailToast('Bạn không có quyền thực hiện chức năng này. Mời đăng nhập lại');
          localStorage.clear();
          setTimeout(() => {
            document.body.classList.add('login');
            this.router.navigate(['/auth/login']);
          }, 100);
          break;
        }

        // lỗi khi update bản ghi mà người khác cũng đang update
        case 1021:
        case 1022:
        case 423:
          let message = '';
          if (Number(res.error.data) === 5) {
            message = ErrorCodes[`420`];
          } else {
            message = 'Bạn đăng nhập sai ' + res.error.data + ' lần' + ErrorCodes[res.status];
          }
          this.swalAlertService.openWarningToast(message);
          break;
        case 492:
          this.swalAlertService.openWarningToast(res.error.data);
          break;
        case 522: {
          this.swalAlertService.openWarningToast('Dũ liệu đã bị thay đổi');
          break;
        }
        case 3001: {
          this.swalAlertService.openFailToast(res.error.toString().replace(/,/g, '<br/>'));
          break;
        }
        default: {
          let msg = ErrorCodes[res.status];
          let params = res.error;
          if (params && typeof params === 'string' && params.indexOf('params:') > -1) {
            params = params.replace('params:', '');
            params.split(';').forEach((it, index) => {
              msg = msg.replace('{' + index + '}', it);
            });
          }
          this.swalAlertService.openWarningToast(res.name && res.name === this.msgTimeout
            ? 'Sever không phản hồi. Quá thời gian thực hiện truy vấn' : msg ? msg : 'Có lỗi xảy ra', 'Thông Báo');
          break;
        }
      }
      return of(res);
    }) as any);
  }


}
