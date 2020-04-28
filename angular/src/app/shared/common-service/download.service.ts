import { Injectable } from '@angular/core';
import { ToastService } from '../swal-alert/toast.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private swalAlertService: ToastService) {}

  downloadFile(data) {
    if (!data) {
      this.swalAlertService.openWarningToast('Không có file để download');
      return;
    }
    const resFileName = data.headers.get('content-disposition');
    if (!resFileName) {
      this.swalAlertService.openWarningToast('Không có file để download');
      return;
    }
    const fileName = resFileName.substr(resFileName.indexOf('filename=') + 9); // 9: length of string 'filename='
    const link = document.createElement('a');
    const url = URL.createObjectURL(data.body);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}

