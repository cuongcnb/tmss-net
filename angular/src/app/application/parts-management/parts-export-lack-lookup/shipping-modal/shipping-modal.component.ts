import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'shipping-modal',
  templateUrl: './shipping-modal.component.html',
  styleUrls: ['./shipping-modal.component.scss'],
})
export class ShippingModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight;

  constructor(private setModalHeightService: SetModalHeightService) {
  }

  ngOnInit() {
  }

  open() {
    this.modal.show();
    this.onResize();
  }

  reset() {

  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResizeWithoutFooter();
  }

}
