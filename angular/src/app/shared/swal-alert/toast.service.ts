import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class ToastService {

  constructor(
    private toastrService: ToastrService
  ) {
    this.toastrService.toastrConfig.timeOut = 2000;
  }

  openSuccessToast(message?: string, title?: string) {
    this.toastrService.success(message ? message : 'Thực hiện thành công!', title ? title : 'Thành công');
  }

  openFailToast(message: string, title?: string) {
    this.toastrService.error(message, title ? title : 'Có lỗi xảy ra');
  }

  openWarningToast(message?: string, title?: string) {
    this.toastrService.warning(message ? message : 'Thao tác của bạn có thể gây lỗi', title ? title : 'Cảnh báo');
  }

  openInfoToast(message?: string, title?: string) {
    this.toastrService.info(message, title ? title : 'Thông báo');
  }

  setToastrConfig(timeOut) {
    this.toastrService.toastrConfig.timeOut = timeOut;
  }
}
