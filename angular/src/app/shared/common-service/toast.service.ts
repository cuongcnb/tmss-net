import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})

export class ToastService {

  constructor(
    private toastrService: ToastrService,
  ) {}

  openSuccessModal(message?: string, title?: string) {
    this.toastrService.success(message ? message : 'Action was successful!', title ? title : 'Successful');
  }

  openFailModal(message: string, title?: string) {
    this.toastrService.error(message, title ? title : 'Error');
  }

  openWarningModal(message?: string, title?: string) {
    this.toastrService.warning(message ? message : 'An error occurred', title ? title : 'Warning');
  }

  openWarningForceSelectData(message?: string, title?: string) {
    this.toastrService.warning(message ? message : 'You haven\'t selected any row, please select one to update', title ? title : 'Select a row to update');
  }

  openInfoModal(message?: string, title?: string) {
    this.toastrService.info(message, title ? title : 'Notification');
  }
}
