import { Observable ,  Observer } from 'rxjs';

interface IUploader {
  progress: Observable<IUploadProgress>;
  response: Observable<any>;
  // tslint:disable-next-line:ban-types
  abort: Function;
  // tslint:disable-next-line:ban-types
  send: Function;
  pending: boolean;
}

export interface IUploadProgress {
  total: number;
  loaded: number;
}

export const sendFormData = (url, formData: FormData, headers?) => {
  const ret = {
    pending: true,
  } as IUploader;

  const xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);

  if (headers) {
    Object.keys(headers).forEach(name => {
      xhr.setRequestHeader(name, headers[name]);
    });
  }

  ret.progress = new Observable((observer: Observer<IUploadProgress>) => {
    xhr.upload.onprogress = (event) => {
      observer.next({
        total: event.total,
        loaded: event.loaded,
      });
    };
  });

  ret.response = new Observable((observer: Observer<any>) => {
    xhr.onload = (event: any) => {
      ret.pending = false;
      if (xhr.status !== 200) {
        observer.error({
          message: xhr.response,
          statusCode: xhr.status,
        });
        observer.complete();
        return;
      }

      try {
        observer.next(xhr.response);
      } catch (e) {
        observer.error(e);
      }
      observer.complete();
    };

    xhr.onerror = (event) => {
      ret.pending = false;
      observer.error(event);
    };
  });

  ret.abort = () => {
    ret.pending = false;
    xhr.abort();
  };

  ret.send = () => {
    ret.pending = true;
    xhr.send(formData);
    return ret;
  };

  return ret;
};
