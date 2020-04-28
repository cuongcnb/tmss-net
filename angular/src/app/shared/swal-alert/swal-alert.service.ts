import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwalAlertService {
  private successModal;
  private failModal;
  private warningModal;
  title: string;
  message: string;

  openSuccessModal(message?: string, title?: string) {
    this.title = title ? title : '';
    this.message = message ? message : '';

    setTimeout(() => {
      this.successModal.show();
    }, 200);
  }

  openFailModal(message: string, title?: string) {
    this.title = title ? title : '';
    this.message = message;

    setTimeout(() => {
      this.failModal.show();
    }, 200);
  }

  openWarningModal(message?: string, title?: string) {
    this.title = title ? title : '';
    this.message = message;

    setTimeout(() => {
      this.warningModal.show();
    }, 200);
  }

  setSuccessModal(modal) {
    this.successModal = modal;
  }

  setFailModal(modal) {
    this.failModal = modal;
  }

  setWarningModal(modal) {
    this.warningModal = modal;
  }

}
