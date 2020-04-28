import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ConfirmService {
  private confirmModal;
  title: string;
  message: string;
  subscriber;

  openConfirmModal(title?, message?) {
    this.title = title ? title : '';
    this.message = message ? message : '';
    setTimeout(() => {
      this.confirmModal.show();
    }, 100);

    return new Observable(subscriber => {
      this.subscriber = subscriber;
    });
  }

  setConfirmModal(modal) {
    this.confirmModal = modal;
  }
}
