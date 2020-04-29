import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'proposal-in-booking',
  templateUrl: './proposal-in-booking.component.html',
  styleUrls: ['./proposal-in-booking.component.scss'],
})
export class ProposalInBookingComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open() {
    this.modal.show();
    this.buildForm();
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      carType: [undefined],
      repairType: [undefined],
      isTime: [false],
      time: [undefined],
    });
  }
}
