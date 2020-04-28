import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalAlertService } from './swal-alert.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'swal-alert',
  templateUrl: './swal-alert.component.html'
})
export class SwalAlertComponent implements OnInit {
  @ViewChild('forceErrorModal', {static: false}) forceErrorModal;
  @ViewChild('forceSuccessModal', {static: false}) forceSuccessModal;
  @ViewChild('forceWarningModal', {static: false}) forceWarningModal;

  constructor(
    private swalAlertService: SwalAlertService
  ) {
  }

  get title() {
    return this.swalAlertService.title;
  }

  get message() {
    return this.swalAlertService.message;
  }

  ngOnInit() {
    this.swalAlertService.setFailModal(this.forceErrorModal);
    this.swalAlertService.setSuccessModal(this.forceSuccessModal);
    this.swalAlertService.setWarningModal(this.forceWarningModal);
  }
}
