import { Injectable } from '@angular/core';
import { ToastService } from '../swal-alert/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ValidateBeforeSearchService {

  constructor(
    private toastService: ToastService,
  ) {
  }

  validSearchDateRange(fromDate, toDate, require = true) {
    if (require && (!fromDate || !toDate)) {
      this.toastService.openWarningToast('Bắt buộc nhập "Từ ngày" và "Đến ngày"');
      return false;
    }
    if (fromDate > toDate) {
      this.toastService.openWarningToast('"Từ ngày" phải nhỏ hơn "Đến ngày"');
      return false;
    }
    return true;
  }

  setBlankFieldsToNull(formValue) {
    for (const key in formValue.value) {
      if (formValue.value[key] === '') {
        formValue.value[key] = null;
      }
    }
    return formValue;
  }
}
