import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'approval-claim-modal',
  templateUrl: './approval-claim-modal.component.html',
  styleUrls: ['./approval-claim-modal.component.scss'],
})
export class ApprovalClaimModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight;

  constructor(private setModalHeightService: SetModalHeightService) {
  }

  ngOnInit() {
  }

  open() {
    this.modal.show();
  }

  reset() {

  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResizeWithoutFooter();
  }
}
