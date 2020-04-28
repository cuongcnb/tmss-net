import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmService } from './confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
})
export class ConfirmationComponent implements OnInit {
  @ViewChild('confirmModal', {static: true}) confirmModal;

  constructor(
    private confirmService: ConfirmService
  ) { }

  get title() {
    return this.confirmService.title;
  }

  get message() {
    return this.confirmService.message;
  }

  ngOnInit() {
    this.confirmService.setConfirmModal(this.confirmModal);
  }

  onClose() {
    this.confirmService.subscriber.next();
  }

  onCancel() {
    this.confirmService.subscriber.error();
  }

}
